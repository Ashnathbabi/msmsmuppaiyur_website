const db = require("../config/db");

// ============================================================
// GET ALL MENU ITEMS
// ============================================================

exports.getMenuItems = async (req, res) => {
  try {
    const [rows] = await db.query(`
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
      data: rows,
    });
  } catch (error) {
    console.error("Get menu items error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch menu items",
    });
  }
};

// ============================================================
// GET ACTIVE MENU ITEMS
// ============================================================

exports.getActiveMenuItems = async (req, res) => {
  try {
    const [rows] = await db.query(`
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
      data: rows,
    });
  } catch (error) {
    console.error("Get active menu items error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active menu items",
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

    const displayOrder = Number(sort_order) || 0;

    const itemStatus =
      status === undefined ? 1 : Number(status);

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
        displayOrder,
        itemStatus,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Add menu item error:", error);

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

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Menu item ID is required",
      });
    }

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
      `,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const displayOrder = Number(sort_order) || 0;

    const itemStatus =
      status === undefined ? 1 : Number(status);

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
        displayOrder,
        itemStatus,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
    });
  } catch (error) {
    console.error("Update menu item error:", error);

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

    const [rows] = await db.query(
      `
      SELECT id
      FROM header_menu_items
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
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
    console.error("Delete menu item error:", error);

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
      const itemId = Number(items[i].id);

      if (!itemId) continue;

      await connection.query(
        `
        UPDATE header_menu_items
        SET sort_order = ?
        WHERE id = ?
        `,
        [i + 1, itemId]
      );
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Menu items reordered successfully",
    });
  } catch (error) {
    console.error("Reorder menu items error:", error);

    if (connection) {
      await connection.rollback();
    }

    return res.status(500).json({
      success: false,
      message: "Failed to reorder menu items",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};