
const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// =====================================================
// GET GENERAL INNER GALLERY IMAGES
// =====================================================

const getGeneralImages = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        gallery_type,
        academic_year_id,
        event_id,
        title,
        image,
        status
      FROM gallery_images
      WHERE gallery_type = 'inner'
        AND event_id IS NULL
        AND academic_year_id IS NULL
      ORDER BY id DESC
    `);

    return res.status(200).json({
      success: true,
      images: rows,
    });
  } catch (error) {
    console.error("getGeneralImages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load general gallery images",
      error: error.message,
    });
  }
};


// =====================================================
// GET ACADEMIC YEARS
// =====================================================

const getYears = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        year_name,
        is_active,
        created_at
      FROM academic_years
      ORDER BY id DESC
    `);

    return res.status(200).json({
      success: true,
      years: rows,
    });
  } catch (error) {
    console.error("getYears error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load academic years",
      error: error.message,
    });
  }
};


// =====================================================
// GET ADMIN ACADEMIC YEARS
// =====================================================

const getAdminYears = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        year_name,
        is_active,
        created_at
      FROM academic_years
      ORDER BY id DESC
    `);

    return res.status(200).json({
      success: true,
      years: rows,
    });
  } catch (error) {
    console.error("getAdminYears error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load academic years",
      error: error.message,
    });
  }
};


// =====================================================
// GET EVENTS BY ACADEMIC YEAR
// =====================================================

const getEventsByYear = async (req, res) => {
  try {
    const { yearId } = req.params;

    if (!yearId) {
      return res.status(400).json({
        success: false,
        message: "Academic year ID is required",
      });
    }

    const [rows] = await db.query(
      `
      SELECT
        id,
        academic_year_id,
        event_name,
        is_active,
        created_at
      FROM gallery_events
      WHERE academic_year_id = ?
      ORDER BY id DESC
      `,
      [yearId]
    );

    return res.status(200).json({
      success: true,
      events: rows,
    });
  } catch (error) {
    console.error("getEventsByYear error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load events",
      error: error.message,
    });
  }
};


// =====================================================
// GET EVENT IMAGES
// =====================================================

const getEventImages = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    const [rows] = await db.query(
      `
      SELECT
        id,
        gallery_type,
        academic_year_id,
        event_id,
        title,
        image,
        status
      FROM gallery_images
      WHERE event_id = ?
        AND gallery_type = 'inner'
      ORDER BY id DESC
      `,
      [eventId]
    );

    return res.status(200).json({
      success: true,
      images: rows,
    });
  } catch (error) {
    console.error("getEventImages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load event images",
      error: error.message,
    });
  }
};


// =====================================================
// CREATE ACADEMIC YEAR
// =====================================================

const createYear = async (req, res) => {
  try {
    const {
      year_name,
      is_active = 1,
    } = req.body;

    if (
      !year_name ||
      typeof year_name !== "string" ||
      !year_name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Academic year is required",
      });
    }

    // Check duplicate
    const [existing] = await db.query(
      `
      SELECT id
      FROM academic_years
      WHERE year_name = ?
      LIMIT 1
      `,
      [year_name.trim()]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Academic year already exists",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO academic_years
      (
        year_name,
        is_active
      )
      VALUES (?, ?)
      `,
      [
        year_name.trim(),
        is_active ? 1 : 0,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Academic year created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("createYear error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create academic year",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE ACADEMIC YEAR STATUS
// =====================================================

const updateYearStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Academic year ID is required",
      });
    }

    await db.query(
      `
      UPDATE academic_years
      SET is_active = ?
      WHERE id = ?
      `,
      [
        is_active ? 1 : 0,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Academic year status updated successfully",
    });
  } catch (error) {
    console.error("updateYearStatus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update academic year status",
      error: error.message,
    });
  }
};


// =====================================================
// CREATE EVENT
// =====================================================

const createEvent = async (req, res) => {
  try {
    const {
      academic_year_id,
      event_name,
      is_active = 1,
    } = req.body;

    if (!academic_year_id) {
      return res.status(400).json({
        success: false,
        message: "Academic year is required",
      });
    }

    if (
      !event_name ||
      typeof event_name !== "string" ||
      !event_name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Event name is required",
      });
    }

    // =================================================
    // CHECK ACADEMIC YEAR
    // IMPORTANT:
    // Uses academic_years, not gallery_academic_years
    // =================================================

    const [yearRows] = await db.query(
      `
      SELECT
        id,
        year_name
      FROM academic_years
      WHERE id = ?
      LIMIT 1
      `,
      [academic_year_id]
    );

    if (yearRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Academic year not found",
      });
    }

    // =================================================
    // CHECK DUPLICATE EVENT
    // =================================================

    const [existing] = await db.query(
      `
      SELECT id
      FROM gallery_events
      WHERE academic_year_id = ?
        AND event_name = ?
      LIMIT 1
      `,
      [
        academic_year_id,
        event_name.trim(),
      ]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This event already exists",
      });
    }

    // =================================================
    // INSERT EVENT
    // =================================================

    const [result] = await db.query(
      `
      INSERT INTO gallery_events
      (
        academic_year_id,
        event_name,
        is_active
      )
      VALUES (?, ?, ?)
      `,
      [
        academic_year_id,
        event_name.trim(),
        is_active ? 1 : 0,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("createEvent error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE EVENT STATUS
// =====================================================

const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    await db.query(
      `
      UPDATE gallery_events
      SET is_active = ?
      WHERE id = ?
      `,
      [
        is_active ? 1 : 0,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Event status updated successfully",
    });
  } catch (error) {
    console.error("updateEventStatus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update event status",
      error: error.message,
    });
  }
};


// =====================================================
// UPLOAD GALLERY IMAGES
// =====================================================

const uploadGalleryImages = async (req, res) => {
  try {
    const {
      academic_year_id,
      event_id,
      title = "",
    } = req.body;

    // =================================================
    // CHECK FILES
    // =================================================

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one image",
      });
    }

    const galleryType = "inner";

    // =================================================
    // EVENT IMAGE UPLOAD
    // =================================================

    if (event_id) {
      const [eventRows] = await db.query(
        `
        SELECT
          id,
          academic_year_id
        FROM gallery_events
        WHERE id = ?
        LIMIT 1
        `,
        [event_id]
      );

      if (eventRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      const eventAcademicYearId =
        eventRows[0].academic_year_id;

      const insertedImages = [];

      for (const file of req.files) {
        const imagePath =
          `/uploads/gallery/${file.filename}`;

        const [result] = await db.query(
          `
          INSERT INTO gallery_images
          (
            gallery_type,
            academic_year_id,
            event_id,
            title,
            image,
            status
          )
          VALUES (?, ?, ?, ?, ?, 1)
          `,
          [
            galleryType,
            eventAcademicYearId,
            event_id,
            title || "",
            imagePath,
          ]
        );

        insertedImages.push({
          id: result.insertId,
          image: imagePath,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Event images uploaded successfully",
        images: insertedImages,
      });
    }

    // =================================================
    // GENERAL INNER GALLERY
    // MAXIMUM 4 IMAGES
    // =================================================

    const [countRows] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM gallery_images
      WHERE gallery_type = 'inner'
        AND event_id IS NULL
        AND academic_year_id IS NULL
      `
    );

    const currentCount =
      Number(countRows[0]?.total || 0);

    if (
      currentCount + req.files.length > 4
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Only 4 general gallery images are allowed. ` +
          `Currently ${currentCount} image(s) exist.`,
      });
    }

    const insertedImages = [];

    for (const file of req.files) {
      const imagePath =
        `/uploads/gallery/${file.filename}`;

      const [result] = await db.query(
        `
        INSERT INTO gallery_images
        (
          gallery_type,
          academic_year_id,
          event_id,
          title,
          image,
          status
        )
        VALUES (?, NULL, NULL, ?, ?, 1)
        `,
        [
          galleryType,
          title || "",
          imagePath,
        ]
      );

      insertedImages.push({
        id: result.insertId,
        image: imagePath,
      });
    }

    return res.status(201).json({
      success: true,
      message:
        "General gallery images uploaded successfully",
      images: insertedImages,
    });
  } catch (error) {
    console.error(
      "uploadGalleryImages error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to upload gallery images",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE GALLERY IMAGE
// =====================================================

const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Image ID is required",
      });
    }

    // Get image before deleting
    const [rows] = await db.query(
      `
      SELECT
        id,
        image
      FROM gallery_images
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    const imagePath = rows[0].image;

    // Delete DB record
    await db.query(
      `
      DELETE FROM gallery_images
      WHERE id = ?
      `,
      [id]
    );

    // =================================================
    // DELETE PHYSICAL FILE
    // =================================================

    if (imagePath) {
      const cleanPath = imagePath
        .replace(/^\/+/, "")
        .replace(/^uploads[\\/]/, "");

      const fullPath = path.join(
        process.cwd(),
        "uploads",
        cleanPath
      );

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    console.error(
      "deleteGalleryImage error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete gallery image",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getGeneralImages,
  getYears,
  getAdminYears,
  getEventsByYear,
  getEventImages,
  createYear,
  updateYearStatus,
  createEvent,
  updateEventStatus,
  uploadGalleryImages,
  deleteGalleryImage,
};