const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadPath = path.join(
    process.cwd(),
    "uploads",
    "activity"
);

// Create folder if it does not exist
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
        recursive: true,
    });
}

console.log("Activity upload path:", uploadPath);

// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Saving image to:", uploadPath);
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        const filename =
            `${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${ext}`;

        console.log("Uploaded filename:", filename);

        cb(null, filename);
    },
});

// =====================================================
// MULTER
// =====================================================

const upload = multer({
    storage: storage,
});

module.exports = upload;