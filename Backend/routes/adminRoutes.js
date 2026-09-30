const express = require("express");

const {
  adminLogin,
  getContacts,
  deleteContact,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", adminLogin);

router.get(
  "/contacts",
  authMiddleware,
  getContacts
);

router.delete(
  "/contacts/:id",
  authMiddleware,
  deleteContact
);

module.exports = router;
