const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// ============================================================
// HELPER - DELETE OLD LOGO FILE
// ============================================================

const deleteOldLogoFile = (logoPath) => {
  try {
    if (!logoPath) return;

    // Only delete files from local uploads/header folder
    if (!logoPath.startsWith("/uploads/header/")) return;

    const fileName = path.basename(logoPath);

    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "header",
      fileName
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Old header logo deleted:", fileName);
    }
  } catch (error) {
    console.error("Delete old logo error:", error);
  }
};

// ============================================================
// GET PUBLIC HEADER DATA
// ============================================================

exports.getHeaderData = async (req, res) => {
  try {
    const [settingsRows] = await db.query(`
      SELECT
        id,
        logo,
        email,
        facebook_url,
        instagram_url,
        youtube_url,
        phone_label,
        phone_number,
        apply_text,
        apply_url,
        status
      FROM header_settings
      WHERE id = 1
      LIMIT 1
    `);

    const [menuRows] = await db.query(`
      SELECT
        id,
        name,
        href,
        sort_order
      FROM header_menu_items
      WHERE status = 1
      ORDER BY sort_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      data: {
        settings: settingsRows.length
          ? settingsRows[0]
          : null,
        menuItems: menuRows,
      },
    });
  } catch (error) {
    console.error("Get header data error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch header data",
    });
  }
};

// ============================================================
// GET ADMIN HEADER DATA
// ============================================================

exports.getAdminHeaderData = async (req, res) => {
  try {
    const [settingsRows] = await db.query(`
      SELECT
        id,
        logo,
        email,
        facebook_url,
        instagram_url,
        youtube_url,
        phone_label,
        phone_number,
        apply_text,
        apply_url,
        status,
        created_at,
        updated_at
      FROM header_settings
      WHERE id = 1
      LIMIT 1
    `);

    const [menuRows] = await db.query(`
      SELECT
        id,
        name,
        href,
        sort_order,
        status,
        created_at,
        updated_at
      FROM header_menu_items
      ORDER BY sort_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      data: {
        settings: settingsRows.length
          ? settingsRows[0]
          : null,
        menuItems: menuRows,
      },
    });
  } catch (error) {
    console.error(
      "Get admin header data error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch header data",
    });
  }
};

// ============================================================
// UPDATE HEADER SETTINGS
// ============================================================

exports.updateHeaderSettings = async (req, res) => {
  try {
    const {
      email,
      facebook_url,
      instagram_url,
      youtube_url,
      phone_label,
      phone_number,
      apply_text,
      apply_url,
      status,
    } = req.body;

    // --------------------------------------------------------
    // GET EXISTING LOGO
    // --------------------------------------------------------

    const [existingRows] = await db.query(`
      SELECT logo
      FROM header_settings
      WHERE id = 1
      LIMIT 1
    `);

    const existingLogo =
      existingRows.length
        ? existingRows[0].logo
        : null;

    // --------------------------------------------------------
    // LOGO
    // --------------------------------------------------------

    let logo = existingLogo;

    if (req.file) {
      logo = `/uploads/header/${req.file.filename}`;

      // Delete previous logo
      if (
        existingLogo &&
        existingLogo !== logo
      ) {
        deleteOldLogoFile(existingLogo);
      }
    }

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    const headerStatus =
      status === undefined
        ? 1
        : Number(status);

    // --------------------------------------------------------
    // INSERT / UPDATE
    // --------------------------------------------------------

    await db.query(
      `
      INSERT INTO header_settings
      (
        id,
        logo,
        email,
        facebook_url,
        instagram_url,
        youtube_url,
        phone_label,
        phone_number,
        apply_text,
        apply_url,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

      ON DUPLICATE KEY UPDATE
        logo = VALUES(logo),
        email = VALUES(email),
        facebook_url = VALUES(facebook_url),
        instagram_url = VALUES(instagram_url),
        youtube_url = VALUES(youtube_url),
        phone_label = VALUES(phone_label),
        phone_number = VALUES(phone_number),
        apply_text = VALUES(apply_text),
        apply_url = VALUES(apply_url),
        status = VALUES(status)
      `,
      [
        1,
        logo,
        email?.trim() || null,
        facebook_url?.trim() || null,
        instagram_url?.trim() || null,
        youtube_url?.trim() || null,
        phone_label?.trim() || "Call Us",
        phone_number?.trim() || null,
        apply_text?.trim() || "Apply Now",
        apply_url?.trim() || "/contact",
        headerStatus,
      ]
    );

    // --------------------------------------------------------
    // GET UPDATED DATA
    // --------------------------------------------------------

    const [updatedRows] = await db.query(`
      SELECT
        id,
        logo,
        email,
        facebook_url,
        instagram_url,
        youtube_url,
        phone_label,
        phone_number,
        apply_text,
        apply_url,
        status
      FROM header_settings
      WHERE id = 1
      LIMIT 1
    `);

    return res.status(200).json({
      success: true,
      message: "Header settings updated successfully",
      data: updatedRows[0],
    });
  } catch (error) {
    console.error(
      "Update header settings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update header settings",
    });
  }
};

// ============================================================
// ADD MENU ITEM
// ============================================================

exports.addMenuItem = async (req, res) => {
  try {
    const {
      name,
      href,
      sort_order,
      status,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Menu name is required",
      });
    }

    if (!href || !href.trim()) {
      return res.status(400).json({
        success: false,
        message: "Menu URL is required",
      });
    }

    const order =
      sort_order === undefined
        ? 0
        : Number(sort_order);

    const itemStatus =
      status === undefined
        ? 1
        : Number(status);

    const [result] = await db.query(
      `
      INSERT INTO header_menu_items
      (
        name,
        href,
        sort_order,
        status
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        name.trim(),
        href.trim(),
        order,
        itemStatus,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error(
      "Add menu item error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to add menu item",
    });
  }
};

// ============================================================
// UPDATE MENU ITEM
// ============================================================

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      href,
      sort_order,
      status,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Menu name is required",
      });
    }

    if (!href || !href.trim()) {
      return res.status(400).json({
        success: false,
        message: "Menu URL is required",
      });
    }

    const [existingRows] = await db.query(
      `
      SELECT id
      FROM header_menu_items
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!existingRows.length) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const itemStatus =
      status === undefined
        ? 1
        : Number(status);

    const order =
      sort_order === undefined
        ? 0
        : Number(sort_order);

    await db.query(
      `
      UPDATE header_menu_items
      SET
        name = ?,
        href = ?,
        sort_order = ?,
        status = ?
      WHERE id = ?
      `,
      [
        name.trim(),
        href.trim(),
        order,
        itemStatus,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
    });
  } catch (error) {
    console.error(
      "Update menu item error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update menu item",
    });
  }
};

// ============================================================
// DELETE MENU ITEM
// ============================================================

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingRows] = await db.query(
      `
      SELECT id
      FROM header_menu_items
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!existingRows.length) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    await db.query(
      `
      DELETE FROM header_menu_items
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete menu item error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete menu item",
    });
  }
};

// ============================================================
// REORDER MENU ITEMS
// ============================================================

exports.reorderMenuItems = async (req, res) => {
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
      const id = Number(items[i]?.id);

      if (!id) {
        continue;
      }

      await connection.query(
        `
        UPDATE header_menu_items
        SET sort_order = ?
        WHERE id = ?
        `,
        [i + 1, id]
      );
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Menu reordered successfully",
    });
  } catch (error) {
    console.error(
      "Reorder menu error:",
      error
    );

    if (connection) {
      await connection.rollback();
    }

    return res.status(500).json({
      success: false,
      message: "Failed to reorder menu",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};