const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const db = require("../config/db");

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDir = path.join(
  __dirname,
  "../uploads/facilities"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const filename =
      "facility-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      ext;

    cb(null, filename);
  },
});

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      ),
      false
    );
  }
};

// =====================================================
// MULTER
// =====================================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// =====================================================
// GET ACTIVE FACILITIES
// =====================================================

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        slug,
        title,
        image,
        tag,
        description,
        content_type,
        status,
        created_at,
        updated_at
      FROM facilities
      WHERE status = 1
      ORDER BY id ASC
    `);

    const data = rows.map((item) => ({
      ...item,
      name: item.title,
    }));

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "GET FACILITIES ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET ALL FACILITIES - ADMIN
// =====================================================

router.get("/admin/all", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        slug,
        title,
        image,
        tag,
        description,
        content_type,
        status,
        created_at,
        updated_at
      FROM facilities
      ORDER BY id DESC
    `);

    const data = rows.map((item) => ({
      ...item,
      name: item.title,
    }));

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "GET ALL FACILITIES ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET FACILITY BY SLUG
// =====================================================

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        slug,
        title,
        image,
        tag,
        description,
        content_type,
        status,
        created_at,
        updated_at
      FROM facilities
      WHERE slug = ?
      AND status = 1
      LIMIT 1
      `,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Facility not found",
      });
    }

    const facility = {
      ...rows[0],
      name: rows[0].title,
      rules: [],
    };

    // =================================================
    // LOAD RULES
    // =================================================

    try {
      const [rules] = await db.query(
        `
        SELECT
          id,
          facility_id,
          rule_text,
          sort_order,
          status
        FROM facility_rules
        WHERE facility_id = ?
        AND status = 1
        ORDER BY sort_order ASC, id ASC
        `,
        [rows[0].id]
      );

      facility.rules = rules;
    } catch (ruleError) {
      console.log(
        "Rules Error:",
        ruleError.message
      );
    }

    res.json({
      success: true,
      data: facility,
    });
  } catch (error) {
    console.error(
      "GET FACILITY ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// CREATE FACILITY
// =====================================================

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        slug,
        tag,
        description,
        content_type,
        status,
      } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      if (!slug) {
        return res.status(400).json({
          success: false,
          message: "Slug is required",
        });
      }

      // =================================================
      // IMAGE PATH
      // =================================================

      let imagePath = null;

      if (req.file) {
        imagePath =
          `/uploads/facilities/${req.file.filename}`;
      }

      // =================================================
      // INSERT
      // =================================================

      const [result] = await db.query(
        `
        INSERT INTO facilities
        (
          slug,
          title,
          image,
          tag,
          description,
          content_type,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          slug,
          title,
          imagePath,
          tag || null,
          description || null,
          content_type || "detail",
          status !== undefined
            ? Number(status)
            : 1,
        ]
      );

      res.status(201).json({
        success: true,
        message:
          "Facility created successfully",
        data: {
          id: result.insertId,
          image: imagePath,
        },
      });
    } catch (error) {
      console.error(
        "CREATE FACILITY ERROR:",
        error
      );

      // Duplicate slug
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          success: false,
          message: "Slug already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// UPDATE FACILITY
// =====================================================

router.put(
  "/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        title,
        slug,
        tag,
        description,
        content_type,
        status,
      } = req.body;

      // =================================================
      // GET OLD RECORD
      // =================================================

      const [oldRows] = await db.query(
        `
        SELECT image
        FROM facilities
        WHERE id = ?
        `,
        [id]
      );

      if (oldRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Facility not found",
        });
      }

      let imagePath =
        oldRows[0].image;

      // =================================================
      // NEW IMAGE
      // =================================================

      if (req.file) {
        imagePath =
          `/uploads/facilities/${req.file.filename}`;

        // Delete old image
        if (
          oldRows[0].image &&
          oldRows[0].image.startsWith(
            "/uploads/facilities/"
          )
        ) {
          const oldFile = path.join(
            __dirname,
            "..",
            oldRows[0].image
          );

          if (fs.existsSync(oldFile)) {
            fs.unlinkSync(oldFile);
          }
        }
      }

      // =================================================
      // UPDATE
      // =================================================

      await db.query(
        `
        UPDATE facilities
        SET
          slug = ?,
          title = ?,
          image = ?,
          tag = ?,
          description = ?,
          content_type = ?,
          status = ?
        WHERE id = ?
        `,
        [
          slug,
          title,
          imagePath,
          tag || null,
          description || null,
          content_type || "detail",
          status !== undefined
            ? Number(status)
            : 1,
          id,
        ]
      );

      res.json({
        success: true,
        message:
          "Facility updated successfully",
        data: {
          id,
          image: imagePath,
        },
      });
    } catch (error) {
      console.error(
        "UPDATE FACILITY ERROR:",
        error
      );

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          success: false,
          message: "Slug already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// =====================================================
// DELETE FACILITY
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT image
      FROM facilities
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Facility not found",
      });
    }

    // Delete image
    if (
      rows[0].image &&
      rows[0].image.startsWith(
        "/uploads/facilities/"
      )
    ) {
      const imageFile = path.join(
        __dirname,
        "..",
        rows[0].image
      );

      if (fs.existsSync(imageFile)) {
        fs.unlinkSync(imageFile);
      }
    }

    await db.query(
      `DELETE FROM facilities WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message:
        "Facility deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE FACILITY ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;