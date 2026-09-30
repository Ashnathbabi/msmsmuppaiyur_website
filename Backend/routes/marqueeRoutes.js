const express = require("express");

const {
  getMarqueeItems,
  getActiveMarqueeItems,
  addMarqueeItem,
  updateMarqueeItem,
  deleteMarqueeItem,
  reorderMarqueeItems,
} = require("../controllers/marqueeController");

const router = express.Router();

// ============================================================
// IMPORTANT:
// STATIC ROUTES BEFORE :id
// ============================================================

// Public
router.get(
  "/active",
  getActiveMarqueeItems
);

// Admin
router.get(
  "/",
  getMarqueeItems
);

// Reorder
router.put(
  "/reorder",
  reorderMarqueeItems
);

// Add
router.post(
  "/",
  addMarqueeItem
);

// Update
router.put(
  "/:id",
  updateMarqueeItem
);

// Delete
router.delete(
  "/:id",
  deleteMarqueeItem
);

module.exports = router;