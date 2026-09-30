const express = require("express");

const {
  createContact,
  getContacts,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

// =====================================================
// PUBLIC
// POST /api/contact
// =====================================================

router.post("/", createContact);

// =====================================================
// ADMIN
// GET /api/contact
// DELETE /api/contact/:id
// =====================================================

router.get("/", getContacts);

router.delete("/:id", deleteContact);

module.exports = router;
