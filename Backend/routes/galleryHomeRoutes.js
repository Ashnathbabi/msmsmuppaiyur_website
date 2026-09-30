const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const controller = require("../controllers/galleryHomeController");

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
// STORAGE
// =====================================================

const storage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        uploadFolder
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {
      const ext =
        path.extname(
          file.originalname
        );

      const name =
        path
          .basename(
            file.originalname,
            ext
          )
          .replace(
            /[^a-zA-Z0-9_-]/g,
            "-"
          )
          .toLowerCase();

      cb(
        null,
        `${Date.now()}-${name}${ext}`
      );
    },
  });

const upload =
  multer({
    storage,
    limits: {
      fileSize:
        10 * 1024 * 1024,
    },
  });

// =====================================================
// ROUTES
// =====================================================

// GET HOME GALLERY
router.get(
  "/",
  controller.getGallery
);

// UPDATE SETTINGS
router.put(
  "/settings",
  controller.updateGallerySettings
);

// ADD HOME IMAGE
router.post(
  "/",
  upload.single("image"),
  controller.addGallery
);

// UPDATE HOME IMAGE
router.put(
  "/:id",
  upload.single("image"),
  controller.updateGallery
);

// DELETE HOME IMAGE
router.delete(
  "/:id",
  controller.deleteGallery
);

module.exports = router;