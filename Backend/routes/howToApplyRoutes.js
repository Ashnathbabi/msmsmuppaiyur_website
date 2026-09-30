const express = require("express");
const multer = require("multer");
const path = require("path");

const controller =
    require("../controllers/howToApplyController");

const router = express.Router();


// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(
            null,
            path.join(
                process.cwd(),
                "uploads",
                "howtoapply"
            )
        );
    },

    filename: function (req, file, cb) {

        const ext =
            path.extname(file.originalname);

        const name =
            path
                .basename(
                    file.originalname,
                    ext
                )
                .replace(/\s+/g, "-")
                .replace(/[^a-zA-Z0-9-_]/g, "")
                .toLowerCase();

        cb(
            null,
            `${name}-${Date.now()}${ext}`
        );
    }
});


const upload = multer({
    storage: storage
});


// =====================================================
// GET
// =====================================================

router.get(
    "/",
    controller.getHowToApply
);


// =====================================================
// SETTINGS
// =====================================================

router.put(
    "/settings",
    controller.updateSettings
);


// =====================================================
// CENTER IMAGE
// =====================================================

router.post(
    "/center-image",
    upload.single("image"),
    controller.uploadCenterImage
);


// =====================================================
// STEPS
// =====================================================

router.post(
    "/steps",
    controller.addStep
);

router.put(
    "/steps/:id",
    controller.updateStep
);

router.delete(
    "/steps/:id",
    controller.deleteStep
);


// =====================================================
// FACILITIES
// =====================================================

router.post(
    "/facilities",
    upload.single("image"),
    controller.addFacility
);

router.put(
    "/facilities/:id",
    upload.single("image"),
    controller.updateFacility
);

router.delete(
    "/facilities/:id",
    controller.deleteFacility
);


module.exports = router;