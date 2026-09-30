const multer = require("multer");
const fs = require("fs");
const path = require("path");

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "gallery"
);

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(
    uploadDir,
    {
      recursive: true,
    }
  );
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
        uploadDir
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {
      const extension =
        path.extname(
          file.originalname
        );

      const baseName =
        path
          .basename(
            file.originalname,
            extension
          )
          .replace(
            /[^a-zA-Z0-9-_]/g,
            "-"
          );

      const uniqueName =
        `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}-${baseName}${extension}`;

      cb(
        null,
        uniqueName
      );
    },
  });

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(
      null,
      true
    );
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
      ),
      false
    );
  }
};

// =====================================================
// MULTER
// =====================================================

const upload =
  multer({
    storage,

    fileFilter,

    limits: {
      fileSize:
        10 * 1024 * 1024,

      files: 50,
    },
  });

// =====================================================
// EXPORT
// =====================================================

module.exports = upload;
