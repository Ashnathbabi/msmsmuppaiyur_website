const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const controller = require("../controllers/galleryInnerController");

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
// MULTER
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
      .toLowerCase();

    cb(
      null,
      `${Date.now()}-${name}${ext}`
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
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
// TEST ROUTE
// =====================================================

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Inner Gallery API working",
  });
});

// =====================================================
// PUBLIC / INNER GALLERY
// =====================================================

router.get(
  "/general-images",
  controller.getGeneralImages
);

router.get(
  "/years",
  controller.getYears
);

router.get(
  "/years/:yearId/events",
  controller.getEventsByYear
);

router.get(
  "/events/:eventId/images",
  controller.getEventImages
);

// =====================================================
// ADMIN - YEARS
// =====================================================

router.get(
  "/admin/years",
  controller.getAdminYears
);

router.post(
  "/admin/years",
  controller.createYear
);

router.put(
  "/admin/years/:id/status",
  controller.updateYearStatus
);

// =====================================================
// ADMIN - EVENTS
// =====================================================

router.post(
  "/admin/events",
  controller.createEvent
);

router.put(
  "/admin/events/:id/status",
  controller.updateEventStatus
);

// =====================================================
// ADMIN - IMAGE UPLOAD
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

module.exports = router;