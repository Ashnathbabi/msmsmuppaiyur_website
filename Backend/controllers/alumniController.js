const pool = require("../config/db");

// =========================================================
// GET ALL ACADEMIC YEARS
// =========================================================

exports.getYears = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        year_name,
        slug,
        created_at
      FROM alumni_academic_years
      ORDER BY id ASC
    `);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("GET YEARS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch academic years",
      error: error.message,
    });
  }
};

// =========================================================
// CREATE ACADEMIC YEAR
// =========================================================

exports.createYear = async (req, res) => {
  try {
    const { year_name, slug } = req.body;

    if (!year_name || !year_name.trim()) {
      return res.status(400).json({
        message: "Academic year is required",
      });
    }

    const cleanYearName = year_name.trim();

    const finalSlug =
      slug && slug.trim()
        ? slug
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "")
        : cleanYearName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");

    const [existing] = await pool.query(
      `
      SELECT id
      FROM alumni_academic_years
      WHERE year_name = ? OR slug = ?
      LIMIT 1
      `,
      [cleanYearName, finalSlug]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Academic year already exists",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO alumni_academic_years
      (
        year_name,
        slug
      )
      VALUES (?, ?)
      `,
      [cleanYearName, finalSlug]
    );

    return res.status(201).json({
      message: "Academic year added successfully",
      id: result.insertId,
      year_name: cleanYearName,
      slug: finalSlug,
    });
  } catch (error) {
    console.error("CREATE YEAR ERROR:", error);

    return res.status(500).json({
      message: "Failed to add academic year",
      error: error.message,
    });
  }
};

// =========================================================
// DELETE ACADEMIC YEAR
// =========================================================

exports.deleteYear = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Academic year ID is required",
      });
    }

    const [year] = await pool.query(
      `
      SELECT id
      FROM alumni_academic_years
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (year.length === 0) {
      return res.status(404).json({
        message: "Academic year not found",
      });
    }

    // Delete gallery images belonging to this year
    await pool.query(
      `
      DELETE FROM alumni_gallery
      WHERE academic_year_id = ?
      `,
      [id]
    );

    // Delete students belonging to this year
    await pool.query(
      `
      DELETE FROM alumni_students
      WHERE academic_year_id = ?
      `,
      [id]
    );

    // Delete year
    await pool.query(
      `
      DELETE FROM alumni_academic_years
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      message: "Academic year deleted successfully",
    });
  } catch (error) {
    console.error("DELETE YEAR ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete academic year",
      error: error.message,
    });
  }
};

// =========================================================
// GET ALL GALLERY IMAGES
//
// IMPORTANT:
// This is for Alumni main page.
// It returns ALL uploaded alumni images.
// =========================================================

exports.getAllGallery = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        academic_year_id,
        image,
        alt_text,
        created_at
      FROM alumni_gallery
      ORDER BY id DESC
    `);

    return res.status(200).json({
      gallery: rows,
    });
  } catch (error) {
    console.error("GET ALL GALLERY ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch alumni gallery",
      error: error.message,
    });
  }
};

// =========================================================
// GET ONE YEAR BY SLUG
//
// IMPORTANT:
// Year click -> students only.
// Gallery is NOT displayed here.
// =========================================================

exports.getYearBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        message: "Academic year slug is required",
      });
    }

    const [years] = await pool.query(
      `
      SELECT
        id,
        year_name,
        slug,
        created_at
      FROM alumni_academic_years
      WHERE slug = ?
      LIMIT 1
      `,
      [slug]
    );

    if (years.length === 0) {
      return res.status(404).json({
        message: "Academic year not found",
      });
    }

    const year = years[0];

    const [students] = await pool.query(
      `
      SELECT
        id,
        academic_year_id,
        name,
        course,
        contact,
        created_at
      FROM alumni_students
      WHERE academic_year_id = ?
      ORDER BY id DESC
      `,
      [year.id]
    );

    return res.status(200).json({
      year,
      students,
    });
  } catch (error) {
    console.error("GET YEAR BY SLUG ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch alumni",
      error: error.message,
    });
  }
};

// =========================================================
// CREATE STUDENT
// =========================================================

exports.createStudent = async (req, res) => {
  try {
    const {
      academic_year_id,
      name,
      course,
      contact,
    } = req.body;

    if (!academic_year_id || !name?.trim()) {
      return res.status(400).json({
        message:
          "Academic year and student name are required",
      });
    }

    const [year] = await pool.query(
      `
      SELECT id
      FROM alumni_academic_years
      WHERE id = ?
      LIMIT 1
      `,
      [academic_year_id]
    );

    if (year.length === 0) {
      return res.status(404).json({
        message: "Academic year not found",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO alumni_students
      (
        academic_year_id,
        name,
        course,
        contact
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        academic_year_id,
        name.trim(),
        course?.trim() || "",
        contact?.trim() || "",
      ]
    );

    return res.status(201).json({
      message: "Student added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to add student",
      error: error.message,
    });
  }
};

// =========================================================
// UPDATE STUDENT
// =========================================================

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      academic_year_id,
      name,
      course,
      contact,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Student ID is required",
      });
    }

    if (!academic_year_id || !name?.trim()) {
      return res.status(400).json({
        message:
          "Academic year and student name are required",
      });
    }

    const [year] = await pool.query(
      `
      SELECT id
      FROM alumni_academic_years
      WHERE id = ?
      LIMIT 1
      `,
      [academic_year_id]
    );

    if (year.length === 0) {
      return res.status(404).json({
        message: "Academic year not found",
      });
    }

    const [result] = await pool.query(
      `
      UPDATE alumni_students
      SET
        academic_year_id = ?,
        name = ?,
        course = ?,
        contact = ?
      WHERE id = ?
      `,
      [
        academic_year_id,
        name.trim(),
        course?.trim() || "",
        contact?.trim() || "",
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json({
      message: "Student updated successfully",
    });
  } catch (error) {
    console.error("UPDATE STUDENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to update student",
      error: error.message,
    });
  }
};

// =========================================================
// DELETE STUDENT
// =========================================================

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Student ID is required",
      });
    }

    const [result] = await pool.query(
      `
      DELETE FROM alumni_students
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete student",
      error: error.message,
    });
  }
};

// =========================================================
// CREATE GALLERY
// =========================================================

exports.createGallery = async (req, res) => {
  try {
    const {
      academic_year_id,
      alt_text,
    } = req.body;

    if (!academic_year_id) {
      return res.status(400).json({
        message: "Academic year is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const [year] = await pool.query(
      `
      SELECT id
      FROM alumni_academic_years
      WHERE id = ?
      LIMIT 1
      `,
      [academic_year_id]
    );

    if (year.length === 0) {
      return res.status(404).json({
        message: "Academic year not found",
      });
    }

    const image = `/uploads/${req.file.filename}`;

    const [result] = await pool.query(
      `
      INSERT INTO alumni_gallery
      (
        academic_year_id,
        image,
        alt_text
      )
      VALUES (?, ?, ?)
      `,
      [
        academic_year_id,
        image,
        alt_text?.trim() || "Alumni",
      ]
    );

    return res.status(201).json({
      message: "Gallery image added successfully",
      id: result.insertId,
      image,
    });
  } catch (error) {
    console.error("CREATE GALLERY ERROR:", error);

    return res.status(500).json({
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

// =========================================================
// DELETE GALLERY
// =========================================================

exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Gallery image ID is required",
      });
    }

    const [result] = await pool.query(
      `
      DELETE FROM alumni_gallery
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Gallery image not found",
      });
    }

    return res.status(200).json({
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    console.error("DELETE GALLERY ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete gallery image",
      error: error.message,
    });
  }
};
