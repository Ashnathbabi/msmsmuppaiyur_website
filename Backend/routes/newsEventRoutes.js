const express = require("express");

const router = express.Router();

const upload = require("../middleware/newsUpload");

const {
    getNewsEvents,
    getAllNewsEvents,
    getNewsEvent,
    createNewsEvent,
    updateNewsEvent,
    deleteNewsEvent
} = require("../controllers/newsEventController");


// =====================================================
// PUBLIC WEBSITE
// =====================================================

router.get("/", getNewsEvents);


// =====================================================
// ADMIN
// =====================================================

router.get("/admin/all", getAllNewsEvents);


// =====================================================
// CREATE
// =====================================================

router.post(
    "/",
    upload.single("image"),
    createNewsEvent
);


// =====================================================
// SINGLE
// =====================================================

router.get(
    "/:id",
    getNewsEvent
);


// =====================================================
// UPDATE
// =====================================================

router.put(
    "/:id",
    upload.single("image"),
    updateNewsEvent
);


// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    deleteNewsEvent
);


module.exports = router;