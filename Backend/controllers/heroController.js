const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// ============================================================
// UPLOAD DIRECTORY
// ============================================================

const heroUploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "hero"
);

if (!fs.existsSync(heroUploadDirectory)) {
  fs.mkdirSync(heroUploadDirectory, {
    recursive: true,
  });
}

// ============================================================
// GET ALL HERO SLIDES - ADMIN
// ============================================================

exports.getHeroSlides = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        image,
        title,
        description,
        sort_order,
        status,
        created_at,
        updated_at
      FROM hero_slides
      ORDER BY sort_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get hero slides error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hero slides",
    });
  }
};

// ============================================================
// GET ACTIVE HERO SLIDES - PUBLIC
// ============================================================

exports.getActiveHeroSlides = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        image,
        title,
        description,
        sort_order
      FROM hero_slides
      WHERE status = 1
      ORDER BY sort_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "Get active hero slides error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active hero slides",
    });
  }
};

// ============================================================
// ADD HERO SLIDE
// ============================================================

exports.addHeroSlide = async (req, res) => {
  try {
    const {
      title,
      description,
      sort_order,
      status,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Hero title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Hero image is required",
      });
    }

    const imagePath =
      "/uploads/hero/" + req.file.filename;

    const order =
      sort_order === undefined ||
      sort_order === ""
        ? 0
        : Number(sort_order);

    const slideStatus =
      status === undefined
        ? 1
        : Number(status);

    const [result] = await db.query(
      `
      INSERT INTO hero_slides
      (
        image,
        title,
        description,
        sort_order,
        status
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        imagePath,
        title.trim(),
        description
          ? description.trim()
          : null,
        order,
        slideStatus,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Hero slide added successfully",
      id: result.insertId,
      data: {
        id: result.insertId,
        image: imagePath,
        title: title.trim(),
        description:
          description
            ? description.trim()
            : null,
        sort_order: order,
        status: slideStatus,
      },
    });
  } catch (error) {
    console.error("Add hero slide error:", error);

    // Delete uploaded file if database insert failed
    if (req.file) {
      const uploadedFilePath = path.join(
        heroUploadDirectory,
        req.file.filename
      );

      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add hero slide",
    });
  }
};

// ============================================================
// UPDATE HERO SLIDE
// ============================================================

exports.updateHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      sort_order,
      status,
    } = req.body;

    // --------------------------------------------------------
    // CHECK EXISTING SLIDE
    // --------------------------------------------------------

    const [existingRows] = await db.query(
      `
      SELECT
        id,
        image,
        title,
        description,
        sort_order,
        status
      FROM hero_slides
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!existingRows.length) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    const existingSlide = existingRows[0];

    // --------------------------------------------------------
    // VALIDATE TITLE
    // --------------------------------------------------------

    const updatedTitle =
      title !== undefined
        ? title.trim()
        : existingSlide.title;

    if (!updatedTitle) {
      return res.status(400).json({
        success: false,
        message: "Hero title is required",
      });
    }

    // --------------------------------------------------------
    // IMAGE
    // --------------------------------------------------------

    let updatedImage = existingSlide.image;

    if (req.file) {
      updatedImage =
        "/uploads/hero/" +
        req.file.filename;
    }

    // --------------------------------------------------------
    // DESCRIPTION
    // --------------------------------------------------------

    const updatedDescription =
      description !== undefined
        ? description.trim()
        : existingSlide.description;

    // --------------------------------------------------------
    // SORT ORDER
    // --------------------------------------------------------

    const updatedSortOrder =
      sort_order !== undefined &&
      sort_order !== ""
        ? Number(sort_order)
        : existingSlide.sort_order;

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    const updatedStatus =
      status !== undefined
        ? Number(status)
        : existingSlide.status;

    // --------------------------------------------------------
    // UPDATE DATABASE
    // --------------------------------------------------------

    await db.query(
      `
      UPDATE hero_slides
      SET
        image = ?,
        title = ?,
        description = ?,
        sort_order = ?,
        status = ?
      WHERE id = ?
      `,
      [
        updatedImage,
        updatedTitle,
        updatedDescription || null,
        updatedSortOrder,
        updatedStatus,
        id,
      ]
    );

    // --------------------------------------------------------
    // DELETE OLD IMAGE
    // --------------------------------------------------------

    if (
      req.file &&
      existingSlide.image
    ) {
      const oldImageName = path.basename(
        existingSlide.image
      );

      const oldImagePath = path.join(
        heroUploadDirectory,
        oldImageName
      );

      if (
        fs.existsSync(oldImagePath)
      ) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (deleteError) {
          console.error(
            "Failed to delete old hero image:",
            deleteError
          );
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Hero slide updated successfully",
      data: {
        id: Number(id),
        image: updatedImage,
        title: updatedTitle,
        description:
          updatedDescription || null,
        sort_order: updatedSortOrder,
        status: updatedStatus,
      },
    });
  } catch (error) {
    console.error(
      "Update hero slide error:",
      error
    );

    // Delete newly uploaded file if update failed
    if (req.file) {
      const uploadedFilePath = path.join(
        heroUploadDirectory,
        req.file.filename
      );

      if (fs.existsSync(uploadedFilePath)) {
        try {
          fs.unlinkSync(uploadedFilePath);
        } catch (deleteError) {
          console.error(
            "Failed to delete uploaded image:",
            deleteError
          );
        }
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update hero slide",
    });
  }
};

// ============================================================
// DELETE HERO IMAGE ONLY
// ============================================================

exports.deleteHeroImage = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT image
      FROM hero_slides
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    const image = rows[0].image;

    if (image) {
      const imageName = path.basename(image);

      const imagePath = path.join(
        heroUploadDirectory,
        imageName
      );

      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (deleteError) {
          console.error(
            "Delete hero image error:",
            deleteError
          );
        }
      }
    }

    await db.query(
      `
      UPDATE hero_slides
      SET image = NULL
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Hero image deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete hero image error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete hero image",
    });
  }
};

// ============================================================
// DELETE HERO SLIDE
// ============================================================

exports.deleteHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT image
      FROM hero_slides
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    const image = rows[0].image;

    // --------------------------------------------------------
    // DELETE DATABASE RECORD
    // --------------------------------------------------------

    await db.query(
      `
      DELETE FROM hero_slides
      WHERE id = ?
      `,
      [id]
    );

    // --------------------------------------------------------
    // DELETE IMAGE FILE
    // --------------------------------------------------------

    if (image) {
      const imageName = path.basename(image);

      const imagePath = path.join(
        heroUploadDirectory,
        imageName
      );

      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (deleteError) {
          console.error(
            "Failed to delete hero image file:",
            deleteError
          );
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Hero slide deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete hero slide error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete hero slide",
    });
  }
};

// ============================================================
// REORDER HERO SLIDES
// ============================================================

exports.reorderHeroSlides = async (req, res) => {
  let connection;

  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reorder data",
      });
    }

    connection = await db.getConnection();

    await connection.beginTransaction();

    for (let i = 0; i < items.length; i++) {
      const id = Number(items[i].id);

      if (!id) {
        continue;
      }

      await connection.query(
        `
        UPDATE hero_slides
        SET sort_order = ?
        WHERE id = ?
        `,
        [i + 1, id]
      );
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Hero slides reordered successfully",
    });
  } catch (error) {
    console.error(
      "Reorder hero slides error:",
      error
    );

    if (connection) {
      await connection.rollback();
    }

    return res.status(500).json({
      success: false,
      message: "Failed to reorder hero slides",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};