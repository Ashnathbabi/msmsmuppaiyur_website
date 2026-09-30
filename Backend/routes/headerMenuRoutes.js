const express = require("express");

const {
  getMenuItems,
  getActiveMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
} = require("../controllers/headerMenuController");

const router = express.Router();

// ============================================================
// PUBLIC
// ============================================================

router.get(
  "/active",
  getActiveMenuItems
);

// ============================================================
// ADMIN
// ============================================================

router.get(
  "/",
  getMenuItems
);

router.put(
  "/reorder",
  reorderMenuItems
);

router.post(
  "/",
  addMenuItem
);

router.put(
  "/:id",
  updateMenuItem
);

router.delete(
  "/:id",
  deleteMenuItem
);

module.exports = router;