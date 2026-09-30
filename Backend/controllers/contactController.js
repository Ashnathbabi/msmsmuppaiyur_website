const pool = require("../config/db");
const sendContactEmail = require("../utils/sendEmail");

// =====================================================
// CREATE CONTACT
// POST /api/contact
// =====================================================

const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    // ==============================
    // VALIDATION
    // ==============================

    if (
      !name ||
      !email ||
      !phone ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ==============================
    // SAVE TO DATABASE
    // ==============================

    const [result] = await pool.execute(
      `
        INSERT INTO contacts
        (
          name,
          email,
          phone,
          subject,
          message
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        name.trim(),
        email.trim(),
        phone.trim(),
        subject.trim(),
        message.trim(),
      ]
    );

    console.log(
      "✅ Contact saved to database:",
      result.insertId
    );

    // ==============================
    // SEND EMAIL
    // ==============================

    try {
      await sendContactEmail({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      console.log("✅ Contact email sent successfully");

    } catch (emailError) {
      console.error(
        "❌ Email sending failed:",
        emailError.message
      );

      // IMPORTANT:
      // Database save succeeded even if email failed.
    }

    // ==============================
    // RESPONSE
    // ==============================

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contactId: result.insertId,
    });

  } catch (error) {
    console.error(
      "❌ Contact controller error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================================
// GET ALL CONTACTS
// GET /api/contact
// =====================================================

const getContacts = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT
        id,
        name,
        email,
        phone,
        subject,
        message,
        created_at
      FROM contacts
      ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      messages: rows,
    });
  } catch (error) {
    console.error(
      "GET CONTACTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch contact messages",
    });
  }
};

// =====================================================
// DELETE CONTACT
// DELETE /api/contact/:id
// =====================================================

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Contact ID is required",
      });
    }

    const [result] = await pool.execute(
      `
      DELETE FROM contacts
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE CONTACT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete contact message",
    });
  }
};

module.exports = {
  createContact,
  getContacts,
  deleteContact,
};
