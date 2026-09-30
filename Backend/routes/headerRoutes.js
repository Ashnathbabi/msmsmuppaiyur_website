const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getHeaderData,
  getAdminHeaderData,
  updateHeaderSettings,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
} = require("../controllers/headerController");

const router = express.Router();

// ============================================================
// HEADER UPLOAD DIRECTORY
// ============================================================

const uploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "header"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ============================================================
// MULTER STORAGE
// ============================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const fileName =
      "logo-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, fileName);
  },
});

// ============================================================
// FILE FILTER
// ============================================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/svg+xml",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP and SVG images are allowed"
      )
    );
  }
};

// ============================================================
// MULTER
// ============================================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ============================================================
// HEADER LOGO UPLOAD MIDDLEWARE
// ============================================================

const uploadLogo = (req, res, next) => {
  upload.single("logo")(
    req,
    res,
    (error) => {
      if (error) {
        console.error(
          "Header logo upload error:",
          error
        );

        return res.status(400).json({
          success: false,
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "Logo size must be less than 5MB"
              : error.message ||
                "Logo upload failed",
        });
      }

      next();
    }
  );
};

// ============================================================
// PUBLIC HEADER
// ============================================================

// GET /api/header
router.get("/", getHeaderData);

// ============================================================
// ADMIN HEADER
// ============================================================

// GET /api/header/admin
router.get(
  "/admin",
  getAdminHeaderData
);

// ============================================================
// UPDATE HEADER SETTINGS
// ============================================================

// PUT /api/header/settings
router.put(
  "/settings",
  uploadLogo,
  updateHeaderSettings
);

// ============================================================
// MENU REORDER
// IMPORTANT: MUST COME BEFORE /menu/:id
// ============================================================

// PUT /api/header/menu/reorder
router.put(
  "/menu/reorder",
  reorderMenuItems
);

// ============================================================
// ADD MENU ITEM
// ============================================================

// POST /api/header/menu
router.post(
  "/menu",
  addMenuItem
);

// ============================================================
// UPDATE MENU ITEM
// ============================================================

// PUT /api/header/menu/:id
router.put(
  "/menu/:id",
  updateMenuItem
);

// ============================================================
// DELETE MENU ITEM
// ============================================================

// DELETE /api/header/menu/:id
router.delete(
  "/menu/:id",
  deleteMenuItem
);

module.exports = router;