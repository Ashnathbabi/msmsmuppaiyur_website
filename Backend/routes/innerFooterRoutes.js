const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const controller = require("../controllers/innerFooterController");


/* =========================================================
   UPLOAD DIRECTORY
========================================================= */

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "inner-footer"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}


/* =========================================================
   MULTER STORAGE
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const name =
      path
        .basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .toLowerCase();

    cb(
      null,
      `${name}-${Date.now()}${ext}`
    );
  },
});


/* =========================================================
   FILE FILTER
========================================================= */

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
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
};


const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


/* =========================================================
   GET
========================================================= */

router.get(
  "/",
  controller.getInnerFooter
);


/* =========================================================
   SETTINGS
========================================================= */

router.put(
  "/settings",
  controller.updateSettings
);


/* =========================================================
   LOGO
========================================================= */

router.post(
  "/logo",
  upload.single("logo"),
  controller.uploadLogo
);

router.delete(
  "/logo",
  controller.deleteLogo
);


/* =========================================================
   BACKGROUND
========================================================= */

router.post(
  "/background",
  upload.single("background"),
  controller.uploadBackground
);

router.delete(
  "/background",
  controller.deleteBackground
);


/* =========================================================
   QUICK LINKS
========================================================= */

router.post(
  "/quick-links",
  controller.addQuickLink
);


/*
 IMPORTANT:
 Reorder must come BEFORE /:id
*/

router.put(
  "/quick-links/reorder",
  controller.reorderQuickLinks
);

router.put(
  "/quick-links/:id",
  controller.updateQuickLink
);

router.delete(
  "/quick-links/:id",
  controller.deleteQuickLink
);


/* =========================================================
   MULTER ERROR HANDLER
========================================================= */

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
});


module.exports = router;