const db = require("../config/db");

// ============================================================
// GET ALL MARQUEE ITEMS
// ============================================================

exports.getMarqueeItems = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        title,
        sort_order,
        status,
        created_at,
        updated_at
      FROM marquee_items
      ORDER BY sort_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "Get marquee items error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch marquee items",
    });
  }
};

// ============================================================
// GET ACTIVE MARQUEE ITEMS
// ============================================================

exports.getActiveMarqueeItems = async (
  req,
  res
) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        title,
        sort_order
      FROM marquee_items
      WHERE status = 1
      ORDER BY sort_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "Get active marquee items error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch active marquee items",
    });
  }
};

// ============================================================
// ADD MARQUEE ITEM
// ============================================================

exports.addMarqueeItem = async (
  req,
  res
) => {
  try {
    const {
      title,
      sort_order,
      status,
    } = req.body;

    // --------------------------------------------------------
    // VALIDATE TITLE
    // --------------------------------------------------------

    if (
      !title ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Announcement text is required",
      });
    }

    // --------------------------------------------------------
    // VALUES
    // --------------------------------------------------------

    const displayOrder =
      Number(sort_order) || 0;

    const itemStatus =
      status === undefined
        ? 1
        : Number(status);

    // --------------------------------------------------------
    // INSERT
    // --------------------------------------------------------

    const [result] = await db.query(
      `
      INSERT INTO marquee_items
      (
        title,
        sort_order,
        status
      )
      VALUES (?, ?, ?)
      `,
      [
        title.trim(),
        displayOrder,
        itemStatus,
      ]
    );

    return res.status(201).json({
      success: true,
      message:
        "Marquee item added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error(
      "Add marquee item error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to add marquee item",
    });
  }
};

// ============================================================
// UPDATE MARQUEE ITEM
// ============================================================

exports.updateMarqueeItem = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      title,
      sort_order,
      status,
    } = req.body;

    // --------------------------------------------------------
    // VALIDATE
    // --------------------------------------------------------

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Marquee item ID is required",
      });
    }

    if (
      !title ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Announcement text is required",
      });
    }

    // --------------------------------------------------------
    // CHECK ITEM
    // --------------------------------------------------------

    const [existingRows] =
      await db.query(
        `
        SELECT id
        FROM marquee_items
        WHERE id = ?
        `,
        [id]
      );

    if (
      existingRows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "Marquee item not found",
      });
    }

    // --------------------------------------------------------
    // VALUES
    // --------------------------------------------------------

    const displayOrder =
      Number(sort_order) || 0;

    const itemStatus =
      status === undefined
        ? 1
        : Number(status);

    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    await db.query(
      `
      UPDATE marquee_items
      SET
        title = ?,
        sort_order = ?,
        status = ?
      WHERE id = ?
      `,
      [
        title.trim(),
        displayOrder,
        itemStatus,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message:
        "Marquee item updated successfully",
    });
  } catch (error) {
    console.error(
      "Update marquee item error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update marquee item",
    });
  }
};

// ============================================================
// DELETE MARQUEE ITEM
// ============================================================

exports.deleteMarqueeItem = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------------
    // CHECK ITEM
    // --------------------------------------------------------

    const [rows] = await db.query(
      `
      SELECT id
      FROM marquee_items
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Marquee item not found",
      });
    }

    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------

    await db.query(
      `
      DELETE FROM marquee_items
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message:
        "Marquee item deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete marquee item error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete marquee item",
    });
  }
};

// ============================================================
// REORDER MARQUEE ITEMS
// ============================================================

exports.reorderMarqueeItems = async (
  req,
  res
) => {
  let connection;

  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid reorder data",
      });
    }

    if (items.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          "Nothing to reorder",
      });
    }

    connection =
      await db.getConnection();

    await connection.beginTransaction();

    for (
      let i = 0;
      i < items.length;
      i++
    ) {
      const itemId =
        Number(items[i].id);

      if (!itemId) {
        continue;
      }

      await connection.query(
        `
        UPDATE marquee_items
        SET sort_order = ?
        WHERE id = ?
        `,
        [
          i + 1,
          itemId,
        ]
      );
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message:
        "Marquee items reordered successfully",
    });
  } catch (error) {
    console.error(
      "Reorder marquee items error:",
      error
    );

    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Rollback error:",
          rollbackError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to reorder marquee items",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};