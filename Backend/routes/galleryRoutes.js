const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const controller = require("../controllers/galleryController");

const router = express.Router();

// =====================================================
// UPLOAD FOLDER
// =====================================================

const uploadFolder = path.join(
  process.cwd(),
  "uploads",
  "gallery"
);

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, {
    recursive: true,
  });
}

// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const name = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    cb(
      null,
      `${Date.now()}-${name}${ext}`
    );
  },
});

// =====================================================
// MULTER UPLOAD
// =====================================================

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 50,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
        )
      );
    }

    cb(null, true);
  },
});

// =====================================================
// PUBLIC ROUTES
// =====================================================

// General gallery images
router.get(
  "/general-images",
  controller.getGeneralImages
);

// Academic years
router.get(
  "/years",
  controller.getYears
);

// Events by academic year
router.get(
  "/years/:yearId/events",
  controller.getEventsByYear
);

// Images by event
router.get(
  "/events/:eventId/images",
  controller.getEventImages
);

// =====================================================
// ADMIN - ACADEMIC YEARS
// =====================================================

// Get academic years for admin
router.get(
  "/admin/years",
  controller.getAdminYears
);

// Create academic year
router.post(
  "/admin/years",
  controller.createYear
);

// Activate / deactivate academic year
router.put(
  "/admin/years/:id/status",
  controller.updateYearStatus
);

// =====================================================
// ADMIN - EVENTS
// =====================================================

// Create event
router.post(
  "/admin/events",
  controller.createEvent
);

// Activate / deactivate event
router.put(
  "/admin/events/:id/status",
  controller.updateEventStatus
);

// =====================================================
// ADMIN - GALLERY UPLOAD
// =====================================================

router.post(
  "/admin/upload",
  upload.array("images", 50),
  controller.uploadGalleryImages
);

// =====================================================
// ADMIN - DELETE IMAGE
// =====================================================

router.delete(
  "/admin/images/:id",
  controller.deleteGalleryImage
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;