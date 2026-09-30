const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const controller = require("../controllers/managementController");


// =====================================================
// UPLOAD FOLDER
// =====================================================

const uploadFolder = path.join(
  process.cwd(),
  "uploads",
  "management"
);

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, {
    recursive: true
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

    const ext = path.extname(
      file.originalname
    );

    const name = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .toLowerCase();

    cb(
      null,
      `${Date.now()}-${name}${ext}`
    );

  }

});


const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  }
});


// =====================================================
// ROUTES
// =====================================================

router.get(
  "/",
  controller.getManagement
);


router.post(
  "/",
  upload.single("image"),
  controller.addManagement
);


router.put(
  "/:id",
  upload.single("image"),
  controller.updateManagement
);


router.delete(
  "/:id",
  controller.deleteManagement
);


module.exports = router;