const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const ensureSettings = async () => {
  const [rows] = await db.query(
    "SELECT id FROM inner_footer_settings WHERE id = 1 LIMIT 1"
  );

  if (rows.length === 0) {
    await db.query(
      `
      INSERT INTO inner_footer_settings
      (
        id,
        logo,
        background_image,
        description,
        phone,
        address,
        email,
        privacy_text,
        privacy_url,
        copyright_year,
        powered_by_text,
        powered_by_url,
        facebook_url,
        instagram_url,
        youtube_url
      )
      VALUES
      (
        1,
        '',
        '',
        ?,
        '',
        '',
        '',
        'PRIVATE POLICY',
        '#',
        '2026',
        'Bonifon',
        'https://www.bonifontechnologies.com',
        '',
        '',
        ''
      )
      `,
      [
        'MSMHSS was founded in the year 2006 with a primary objective of "Giving education to the poor and socially less privileged", in order to extend the compassionate ministry of the Servite Order.',
      ]
    );
  }
};


const deleteUploadedFile = (filePath) => {
  if (!filePath) return;

  try {
    const fileName = path.basename(filePath);

    const uploadDir = path.join(
      process.cwd(),
      "uploads",
      "inner-footer"
    );

    const fullPath = path.join(uploadDir, fileName);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("File delete error:", error.message);
  }
};


/* =========================================================
   GET INNER FOOTER
========================================================= */

exports.getInnerFooter = async (req, res) => {
  try {
    await ensureSettings();

    const [settingsRows] = await db.query(
      "SELECT * FROM inner_footer_settings WHERE id = 1 LIMIT 1"
    );

    const [quickLinks] = await db.query(
      `
      SELECT *
      FROM inner_footer_quick_links
      ORDER BY sort_order ASC, id ASC
      `
    );

    res.json({
      success: true,
      settings: settingsRows[0],
      quickLinks,
    });

  } catch (error) {
    console.error("Get Inner Footer Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load inner footer",
    });
  }
};


/* =========================================================
   UPDATE SETTINGS
========================================================= */

exports.updateSettings = async (req, res) => {
  try {
    await ensureSettings();

    const {
      description,
      phone,
      address,
      email,
      privacy_text,
      privacy_url,
      copyright_year,
      powered_by_text,
      powered_by_url,
      facebook_url,
      instagram_url,
      youtube_url,
    } = req.body;

    await db.query(
      `
      UPDATE inner_footer_settings
      SET
        description = ?,
        phone = ?,
        address = ?,
        email = ?,
        privacy_text = ?,
        privacy_url = ?,
        copyright_year = ?,
        powered_by_text = ?,
        powered_by_url = ?,
        facebook_url = ?,
        instagram_url = ?,
        youtube_url = ?
      WHERE id = 1
      `,
      [
        description || "",
        phone || "",
        address || "",
        email || "",
        privacy_text || "PRIVATE POLICY",
        privacy_url || "#",
        copyright_year || "2026",
        powered_by_text || "Bonifon",
        powered_by_url || "#",
        facebook_url || "",
        instagram_url || "",
        youtube_url || "",
      ]
    );

    res.json({
      success: true,
      message: "Inner footer settings updated successfully",
    });

  } catch (error) {
    console.error("Update Inner Footer Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};


/* =========================================================
   UPLOAD LOGO
========================================================= */

exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Logo file is required",
      });
    }

    await ensureSettings();

    const [rows] = await db.query(
      "SELECT logo FROM inner_footer_settings WHERE id = 1"
    );

    const oldLogo = rows[0]?.logo || "";

    const newLogo = `/uploads/inner-footer/${req.file.filename}`;

    await db.query(
      `
      UPDATE inner_footer_settings
      SET logo = ?
      WHERE id = 1
      `,
      [newLogo]
    );

    if (oldLogo) {
      deleteUploadedFile(oldLogo);
    }

    res.json({
      success: true,
      message: "Logo uploaded successfully",
      logo: newLogo,
    });

  } catch (error) {
    console.error("Upload Logo Error:", error);

    if (req.file) {
      deleteUploadedFile(
        `/uploads/inner-footer/${req.file.filename}`
      );
    }

    res.status(500).json({
      success: false,
      message: "Logo upload failed",
    });
  }
};


/* =========================================================
   DELETE LOGO
========================================================= */

exports.deleteLogo = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT logo FROM inner_footer_settings WHERE id = 1"
    );

    const logo = rows[0]?.logo || "";

    await db.query(
      `
      UPDATE inner_footer_settings
      SET logo = ''
      WHERE id = 1
      `
    );

    if (logo) {
      deleteUploadedFile(logo);
    }

    res.json({
      success: true,
      message: "Logo deleted successfully",
    });

  } catch (error) {
    console.error("Delete Logo Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete logo",
    });
  }
};


/* =========================================================
   UPLOAD BACKGROUND
========================================================= */

exports.uploadBackground = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Background image is required",
      });
    }

    await ensureSettings();

    const [rows] = await db.query(
      "SELECT background_image FROM inner_footer_settings WHERE id = 1"
    );

    const oldBackground =
      rows[0]?.background_image || "";

    const newBackground =
      `/uploads/inner-footer/${req.file.filename}`;

    await db.query(
      `
      UPDATE inner_footer_settings
      SET background_image = ?
      WHERE id = 1
      `,
      [newBackground]
    );

    if (oldBackground) {
      deleteUploadedFile(oldBackground);
    }

    res.json({
      success: true,
      message: "Background image uploaded successfully",
      background_image: newBackground,
    });

  } catch (error) {
    console.error("Upload Background Error:", error);

    if (req.file) {
      deleteUploadedFile(
        `/uploads/inner-footer/${req.file.filename}`
      );
    }

    res.status(500).json({
      success: false,
      message: "Background upload failed",
    });
  }
};


/* =========================================================
   DELETE BACKGROUND
========================================================= */

exports.deleteBackground = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT background_image FROM inner_footer_settings WHERE id = 1"
    );

    const background =
      rows[0]?.background_image || "";

    await db.query(
      `
      UPDATE inner_footer_settings
      SET background_image = ''
      WHERE id = 1
      `
    );

    if (background) {
      deleteUploadedFile(background);
    }

    res.json({
      success: true,
      message: "Background image deleted successfully",
    });

  } catch (error) {
    console.error("Delete Background Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete background",
    });
  }
};


/* =========================================================
   ADD QUICK LINK
========================================================= */

exports.addQuickLink = async (req, res) => {
  try {
    const {
      name,
      href,
      status = 1,
    } = req.body;

    if (!name || !href) {
      return res.status(400).json({
        success: false,
        message: "Name and URL are required",
      });
    }

    const [rows] = await db.query(
      `
      SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextOrder
      FROM inner_footer_quick_links
      `
    );

    const nextOrder = rows[0].nextOrder;

    await db.query(
      `
      INSERT INTO inner_footer_quick_links
      (
        name,
        href,
        sort_order,
        status
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        name,
        href,
        nextOrder,
        status ? 1 : 0,
      ]
    );

    res.json({
      success: true,
      message: "Quick link added successfully",
    });

  } catch (error) {
    console.error("Add Quick Link Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add quick link",
    });
  }
};


/* =========================================================
   UPDATE QUICK LINK
========================================================= */

exports.updateQuickLink = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      href,
      status,
    } = req.body;

    await db.query(
      `
      UPDATE inner_footer_quick_links
      SET
        name = ?,
        href = ?,
        status = ?
      WHERE id = ?
      `,
      [
        name,
        href,
        status ? 1 : 0,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Quick link updated successfully",
    });

  } catch (error) {
    console.error("Update Quick Link Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update quick link",
    });
  }
};


/* =========================================================
   DELETE QUICK LINK
========================================================= */

exports.deleteQuickLink = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM inner_footer_quick_links
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Quick link deleted successfully",
    });

  } catch (error) {
    console.error("Delete Quick Link Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete quick link",
    });
  }
};


/* =========================================================
   REORDER QUICK LINKS
========================================================= */

exports.reorderQuickLinks = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reorder data",
      });
    }

    await connection.beginTransaction();

    for (let i = 0; i < items.length; i++) {
      await connection.query(
        `
        UPDATE inner_footer_quick_links
        SET sort_order = ?
        WHERE id = ?
        `,
        [
          i + 1,
          items[i].id,
        ]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: "Quick links reordered successfully",
    });

  } catch (error) {
    await connection.rollback();

    console.error("Reorder Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reorder quick links",
    });

  } finally {
    connection.release();
  }
};