const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const uploadFolder = path.join(
  process.cwd(),
  "uploads",
  "management"
);

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, {
    recursive: true,
  });
};


// =====================================================
// GET MANAGEMENT
// =====================================================

const getManagement = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        id,
        name,
        role,
        image,
        facebook,
        instagram,
        youtube,
        linkedin,
        sort_order,
        status
      FROM management
      WHERE status = 1
      ORDER BY sort_order ASC, id ASC
    `);

    res.status(200).json({
      success: true,
      management: rows
    });

  } catch (error) {

    console.error("GET MANAGEMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load management",
      error: error.message
    });

  }
};


// =====================================================
// ADD MANAGEMENT
// =====================================================

const addManagement = async (req, res) => {
  try {

    const {
      name,
      role,
      facebook,
      instagram,
      youtube,
      linkedin,
      sort_order,
      status
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    if (!role || !role.trim()) {
      return res.status(400).json({
        success: false,
        message: "Role is required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Management image is required"
      });
    }

    const imagePath =
      `/uploads/management/${req.file.filename}`;

    const [result] = await db.query(
      `
      INSERT INTO management
      (
        name,
        role,
        image,
        facebook,
        instagram,
        youtube,
        linkedin,
        sort_order,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name.trim(),
        role.trim(),
        imagePath,
        facebook || null,
        instagram || null,
        youtube || null,
        linkedin || null,
        Number(sort_order) || 0,
        Number(status) === 0 ? 0 : 1
      ]
    );

    res.status(201).json({
      success: true,
      message: "Management added successfully",
      id: result.insertId,
      image: imagePath
    });

  } catch (error) {

    console.error("ADD MANAGEMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add management",
      error: error.message
    });

  }
};


// =====================================================
// UPDATE MANAGEMENT
// =====================================================

const updateManagement = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      role,
      facebook,
      instagram,
      youtube,
      linkedin,
      sort_order,
      status
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    if (!role || !role.trim()) {
      return res.status(400).json({
        success: false,
        message: "Role is required"
      });
    }


    // =================================================
    // NEW IMAGE
    // =================================================

    if (req.file) {

      const [oldData] = await db.query(
        "SELECT image FROM management WHERE id = ?",
        [id]
      );

      if (
        oldData.length > 0 &&
        oldData[0].image
      ) {

        const oldImagePath = path.join(
          process.cwd(),
          oldData[0].image.replace(/^\/+/, "")
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

      }


      const imagePath =
        `/uploads/management/${req.file.filename}`;

      await db.query(
        `
        UPDATE management
        SET
          name = ?,
          role = ?,
          image = ?,
          facebook = ?,
          instagram = ?,
          youtube = ?,
          linkedin = ?,
          sort_order = ?,
          status = ?
        WHERE id = ?
        `,
        [
          name.trim(),
          role.trim(),
          imagePath,
          facebook || null,
          instagram || null,
          youtube || null,
          linkedin || null,
          Number(sort_order) || 0,
          Number(status) === 0 ? 0 : 1,
          id
        ]
      );

    }

    // =================================================
    // WITHOUT NEW IMAGE
    // =================================================

    else {

      await db.query(
        `
        UPDATE management
        SET
          name = ?,
          role = ?,
          facebook = ?,
          instagram = ?,
          youtube = ?,
          linkedin = ?,
          sort_order = ?,
          status = ?
        WHERE id = ?
        `,
        [
          name.trim(),
          role.trim(),
          facebook || null,
          instagram || null,
          youtube || null,
          linkedin || null,
          Number(sort_order) || 0,
          Number(status) === 0 ? 0 : 1,
          id
        ]
      );

    }


    res.json({
      success: true,
      message: "Management updated successfully"
    });

  } catch (error) {

    console.error("UPDATE MANAGEMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update management",
      error: error.message
    });

  }
};


// =====================================================
// DELETE MANAGEMENT
// =====================================================

const deleteManagement = async (req, res) => {
  try {

    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT image FROM management WHERE id = ?",
      [id]
    );

    if (rows.length > 0 && rows[0].image) {

      const imagePath = path.join(
        process.cwd(),
        rows[0].image.replace(/^\/+/, "")
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

    }

    await db.query(
      "DELETE FROM management WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Management deleted successfully"
    });

  } catch (error) {

    console.error("DELETE MANAGEMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete management",
      error: error.message
    });

  }
};


module.exports = {
  getManagement,
  addManagement,
  updateManagement,
  deleteManagement
};