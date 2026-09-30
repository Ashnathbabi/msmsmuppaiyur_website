const express = require("express");

const router = express.Router();

const {
    getActivities,
    getAdminActivities,
    createActivity,
    updateActivity,
    deleteActivity,
} = require("../controllers/activityHomeController");

const upload = require("../middleware/upload");

router.get("/", getActivities);

router.get("/admin", getAdminActivities);

router.post(
    "/",
    upload.single("image"),
    createActivity
);

router.put(
    "/:id",
    upload.single("image"),
    updateActivity
);

router.delete(
    "/:id",
    deleteActivity
);

module.exports = router;