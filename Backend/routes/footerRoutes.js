const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const controller = require("../controllers/footerController");

const router = express.Router();


/*
|--------------------------------------------------------------------------
| Footer Upload Folder
|--------------------------------------------------------------------------
*/

const uploadFolder = path.join(
  process.cwd(),
  "uploads",
  "footer"
);

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, {
    recursive: true
  });
}


/*
|--------------------------------------------------------------------------
| Multer Storage
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },

  filename: (req, file, cb) => {

    const extension = path.extname(
      file.originalname
    );

    const originalName = path.basename(
      file.originalname,
      extension
    );

    const safeName = originalName
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .toLowerCase();

    const filename =
      `${safeName || "footer-logo"}-${Date.now()}${extension}`;

    cb(null, filename);
  }
});


/*
|--------------------------------------------------------------------------
| Multer Configuration
|--------------------------------------------------------------------------
*/

const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed"
        )
      );
    }
  }
});


/*
|--------------------------------------------------------------------------
| GET FOOTER
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  controller.getFooter
);


/*
|--------------------------------------------------------------------------
| UPDATE FOOTER SETTINGS
|--------------------------------------------------------------------------
*/

router.put(
  "/settings",
  controller.updateSettings
);


/*
|--------------------------------------------------------------------------
| UPLOAD LOGO
|--------------------------------------------------------------------------
*/

router.post(
  "/logo",
  (req, res, next) => {

    upload.single("logo")(
      req,
      res,
      (error) => {

        if (error) {

          return res.status(400).json({
            success: false,
            message: error.message
          });

        }

        next();
      }
    );

  },
  controller.uploadLogo
);


/*
|--------------------------------------------------------------------------
| DELETE LOGO
|--------------------------------------------------------------------------
*/

router.delete(
  "/logo",
  controller.deleteLogo
);


/*
|--------------------------------------------------------------------------
| QUICK LINKS
|--------------------------------------------------------------------------
*/

router.post(
  "/quick-links",
  controller.addQuickLink
);

router.put(
  "/quick-links/:id",
  controller.updateQuickLink
);

router.delete(
  "/quick-links/:id",
  controller.deleteQuickLink
);

router.put(
  "/quick-links/reorder",
  controller.reorderQuickLinks
);


/*
|--------------------------------------------------------------------------
| ACADEMIC LINKS
|--------------------------------------------------------------------------
*/

router.post(
  "/academic-links",
  controller.addAcademicLink
);

router.put(
  "/academic-links/:id",
  controller.updateAcademicLink
);

router.delete(
  "/academic-links/:id",
  controller.deleteAcademicLink
);

router.put(
  "/academic-links/reorder",
  controller.reorderAcademicLinks
);


module.exports = router;