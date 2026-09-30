const express = require("express");

const router = express.Router();

const {
  getActivities,
  getAdminActivities,
  getActivityBySlug,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} = require("../controllers/activityController");

const activityUpload = require("../middleware/activityUpload");

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/all",
  getAdminActivities
);

router.get(
  "/admin/:id",
  getActivityById
);

router.post(
  "/admin",
  activityUpload.single("image"),
  createActivity
);

router.put(
  "/admin/:id",
  activityUpload.single("image"),
  updateActivity
);

router.delete(
  "/admin/:id",
  deleteActivity
);

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getActivities
);

router.get(
  "/:slug",
  getActivityBySlug
);

module.exports = router;
