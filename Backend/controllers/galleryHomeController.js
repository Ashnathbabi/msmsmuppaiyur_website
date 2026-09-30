const db = require("../config/db");

// =====================================================
// GET HOME GALLERY
// ONLY gallery_type = home
// =====================================================

const getGallery = async (req, res) => {
  try {
    const [settings] =
      await db.query(`
        SELECT
          id,
          badge_title,
          heading
        FROM gallery_settings
        ORDER BY id ASC
        LIMIT 1
      `);

    const [gallery] =
      await db.query(`
        SELECT
          id,
          gallery_type,
          title,
          image,
          image AS image_url,
          sort_order,
          status
        FROM gallery_images
        WHERE status = 1
        AND gallery_type = 'home'
        ORDER BY
          sort_order ASC,
          id ASC
      `);

    return res.status(200).json({
      success: true,

      settings:
        settings.length > 0
          ? settings[0]
          : {
              badge_title:
                "Gallery",
              heading:
                "Capturing Moments That Celebrate Every Student’s Journey",
            },

      gallery: gallery || [],
    });
  } catch (error) {
    console.error(
      "HOME GALLERY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load home gallery",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE HOME SETTINGS
// =====================================================

const updateGallerySettings =
  async (req, res) => {
    try {
      const {
        badge_title,
        heading,
      } = req.body;

      const [existing] =
        await db.query(`
          SELECT id
          FROM gallery_settings
          ORDER BY id ASC
          LIMIT 1
        `);

      if (existing.length === 0) {
        const [result] =
          await db.query(
            `
            INSERT INTO gallery_settings
            (
              badge_title,
              heading
            )
            VALUES (?, ?)
            `,
            [
              badge_title ||
                "Gallery",
              heading ||
                "Capturing Moments That Celebrate Every Student’s Journey",
            ]
          );

        return res.status(201).json({
          success: true,
          id: result.insertId,
        });
      }

      await db.query(
        `
        UPDATE gallery_settings
        SET
          badge_title = ?,
          heading = ?
        WHERE id = ?
        `,
        [
          badge_title ||
            "Gallery",
          heading ||
            "Capturing Moments That Celebrate Every Student’s Journey",
          existing[0].id,
        ]
      );

      return res.status(200).json({
        success: true,
        message:
          "Gallery settings updated",
      });
    } catch (error) {
      console.error(
        "UPDATE HOME SETTINGS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update gallery settings",
        error: error.message,
      });
    }
  };

// =====================================================
// ADD HOME GALLERY
// =====================================================

const addGallery = async (
  req,
  res
) => {
  try {
    const {
      title,
      sort_order,
      status,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload an image",
      });
    }

    const imagePath =
      `/uploads/gallery/${req.file.filename}`;

    const [result] =
      await db.query(
        `
        INSERT INTO gallery_images
        (
          gallery_type,
          academic_year_id,
          event_id,
          title,
          image,
          sort_order,
          status
        )
        VALUES
        (
          'home',
          NULL,
          NULL,
          ?,
          ?,
          ?,
          ?
        )
        `,
        [
          title?.trim() ||
            req.file.originalname,
          Number(sort_order) || 1,
          Number(status) === 0
            ? 0
            : 1,
        ]
      );

    return res.status(201).json({
      success: true,
      message:
        "Home gallery image added",
      id: result.insertId,
      image: imagePath,
    });
  } catch (error) {
    console.error(
      "ADD HOME GALLERY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to add home gallery",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE HOME GALLERY
// =====================================================

const updateGallery =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        title,
        sort_order,
        status,
      } = req.body;

      const [existing] =
        await db.query(
          `
          SELECT
            id,
            image
          FROM gallery_images
          WHERE id = ?
          AND gallery_type = 'home'
          LIMIT 1
          `,
          [id]
        );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Home gallery image not found",
        });
      }

      let image =
        existing[0].image;

      if (req.file) {
        image =
          `/uploads/gallery/${req.file.filename}`;
      }

      await db.query(
        `
        UPDATE gallery_images
        SET
          title = ?,
          image = ?,
          sort_order = ?,
          status = ?
        WHERE id = ?
        AND gallery_type = 'home'
        `,
        [
          title?.trim() ||
            "Gallery Image",
          image,
          Number(sort_order) || 1,
          Number(status) === 0
            ? 0
            : 1,
          id,
        ]
      );

      return res.status(200).json({
        success: true,
        message:
          "Home gallery image updated",
      });
    } catch (error) {
      console.error(
        "UPDATE HOME GALLERY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update home gallery",
        error: error.message,
      });
    }
  };

// =====================================================
// DELETE HOME GALLERY
// =====================================================

const deleteGallery =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const [existing] =
        await db.query(
          `
          SELECT id
          FROM gallery_images
          WHERE id = ?
          AND gallery_type = 'home'
          LIMIT 1
          `,
          [id]
        );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Home gallery image not found",
        });
      }

      await db.query(
        `
        DELETE FROM gallery_images
        WHERE id = ?
        AND gallery_type = 'home'
        `,
        [id]
      );

      return res.status(200).json({
        success: true,
        message:
          "Home gallery image deleted",
      });
    } catch (error) {
      console.error(
        "DELETE HOME GALLERY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete home gallery",
        error: error.message,
      });
    }
  };

module.exports = {
  getGallery,
  updateGallerySettings,
  addGallery,
  updateGallery,
  deleteGallery,
};