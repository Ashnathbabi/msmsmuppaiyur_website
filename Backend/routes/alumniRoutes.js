const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getYears,
  getAllGallery,
  getYearBySlug,
  createStudent,
  updateStudent,
  deleteStudent,
  createGallery,
  deleteGallery,
  createYear,
  deleteYear,
} = require("../controllers/alumniController");

const router = express.Router();

// =========================================================
// MULTER CONFIGURATION
// =========================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, uniqueName);
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
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed"
        )
      );
    }
  },
});

// =========================================================
// ACADEMIC YEARS
// =========================================================

router.get("/years", getYears);

router.post("/years", createYear);

router.delete(
  "/years/:id",
  deleteYear
);

// =========================================================
// MAIN ALUMNI GALLERY
//
// Alumni menu open:
// GET /api/alumni/gallery
//
// This returns ALL gallery images.
// =========================================================

router.get(
  "/gallery",
  getAllGallery
);

// =========================================================
// YEAR STUDENTS
//
// Click year:
// GET /api/alumni/year/2025-2026
//
// Only students are returned.
// =========================================================

router.get(
  "/year/:slug",
  getYearBySlug
);

// =========================================================
// STUDENTS
// =========================================================

router.post(
  "/students",
  createStudent
);

router.put(
  "/students/:id",
  updateStudent
);

router.delete(
  "/students/:id",
  deleteStudent
);

// =========================================================
// GALLERY
// =========================================================

router.post(
  "/gallery",
  upload.single("image"),
  createGallery
);

router.delete(
  "/gallery/:id",
  deleteGallery
);

module.exports = router;
