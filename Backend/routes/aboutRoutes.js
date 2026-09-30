const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("../config/db");


// ==========================================
// UPLOAD DIRECTORY
// ==========================================

const uploadDir = path.join(__dirname, "../uploads/about");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}


// ==========================================
// MULTER STORAGE
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const name =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      ext;

    cb(null, name);
  },
});


const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});


// ==========================================
// GET ABOUT - WEBSITE
// ==========================================

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM about_school
      WHERE status = 1
      ORDER BY id DESC
      LIMIT 1
    `);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "About content not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });

  } catch (error) {
    console.error("GET ABOUT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch About",
    });
  }
});


// ==========================================
// GET ABOUT - ADMIN
// ==========================================

router.get("/admin", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM about_school
      ORDER BY id DESC
      LIMIT 1
    `);

    res.json({
      success: true,
      data: rows[0] || null,
    });

  } catch (error) {
    console.error("ADMIN ABOUT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch About",
    });
  }
});


// ==========================================
// UPDATE ABOUT + IMAGES
// ==========================================

router.put(
  "/:id",
  upload.fields([
    {
      name: "main_image",
      maxCount: 1,
    },
    {
      name: "about_bg",
      maxCount: 1,
    },
    {
      name: "elements_image",
      maxCount: 1,
    },
    {
      name: "sub_logo",
      maxCount: 1,
    },
  ]),
  async (req, res) => {

    try {

      const { id } = req.params;

      const {
        badge_title,
        heading,
        description,
        status,
      } = req.body;


      // ======================================
      // GET OLD DATA
      // ======================================

      const [oldRows] = await db.query(
        `SELECT *
         FROM about_school
         WHERE id = ?`,
        [id]
      );

      if (!oldRows.length) {
        return res.status(404).json({
          success: false,
          message: "About record not found",
        });
      }

      const oldData = oldRows[0];


      // ======================================
      // KEEP OLD IMAGES IF NEW NOT SELECTED
      // ======================================

      let mainImage = oldData.main_image;
      let aboutBg = oldData.about_bg;
      let elementsImage = oldData.elements_image;
      let subLogo = oldData.sub_logo;


      // ======================================
      // MAIN IMAGE
      // ======================================

      if (
        req.files &&
        req.files.main_image &&
        req.files.main_image[0]
      ) {

        mainImage =
          `/uploads/about/${req.files.main_image[0].filename}`;

      }


      // ======================================
      // ABOUT BACKGROUND
      // ======================================

      if (
        req.files &&
        req.files.about_bg &&
        req.files.about_bg[0]
      ) {

        aboutBg =
          `/uploads/about/${req.files.about_bg[0].filename}`;

      }


      // ======================================
      // ELEMENTS IMAGE
      // ======================================

      if (
        req.files &&
        req.files.elements_image &&
        req.files.elements_image[0]
      ) {

        elementsImage =
          `/uploads/about/${req.files.elements_image[0].filename}`;

      }


      // ======================================
      // SUB LOGO
      // ======================================

      if (
        req.files &&
        req.files.sub_logo &&
        req.files.sub_logo[0]
      ) {

        subLogo =
          `/uploads/about/${req.files.sub_logo[0].filename}`;

      }


      // ======================================
      // UPDATE DATABASE
      // ======================================

      await db.query(
        `UPDATE about_school
         SET
           badge_title = ?,
           heading = ?,
           description = ?,
           main_image = ?,
           about_bg = ?,
           elements_image = ?,
           sub_logo = ?,
           status = ?
         WHERE id = ?`,
        [
          badge_title,
          heading,
          description,
          mainImage,
          aboutBg,
          elementsImage,
          subLogo,
          status ?? 1,
          id,
        ]
      );


      res.json({
        success: true,
        message: "About updated successfully",

        data: {
          main_image: mainImage,
          about_bg: aboutBg,
          elements_image: elementsImage,
          sub_logo: subLogo,
        },
      });

    } catch (error) {

      console.error("UPDATE ABOUT ERROR:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to update About",
      });

    }

  }
);


module.exports = router;