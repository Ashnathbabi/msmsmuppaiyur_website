const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* =========================================================
   GET ALL ACADEMIC PAGES
========================================================= */

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        page_slug,
        page_title,
        description,
        created_at,
        updated_at
      FROM academic_pages
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET ACADEMIC PAGES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch academic pages.",
    });
  }
});

/* =========================================================
   GET SIDEBAR
========================================================= */

router.get("/sidebar", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        page_slug,
        page_title
      FROM academic_pages
      WHERE page_slug != 'academics'
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "GET ACADEMIC SIDEBAR ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch academic sidebar.",
    });
  }
});

/* =========================================================
   CREATE NEW SIDEBAR PAGE
========================================================= */

router.post("/", async (req, res) => {
  try {
    const {
      page_slug,
      page_title,
      description,
    } = req.body;

    if (!page_slug || !page_title) {
      return res.status(400).json({
        success: false,
        message:
          "Page slug and page title are required.",
      });
    }

    const cleanSlug = page_slug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    /* CHECK DUPLICATE */

    const [existing] = await db.query(
      `
      SELECT id
      FROM academic_pages
      WHERE page_slug = ?
      LIMIT 1
      `,
      [cleanSlug]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This page already exists.",
      });
    }

    /* INSERT */

    const [result] = await db.query(
      `
      INSERT INTO academic_pages
      (
        page_slug,
        page_title,
        description
      )
      VALUES (?, ?, ?)
      `,
      [
        cleanSlug,
        page_title.trim(),
        description?.trim() || "",
      ]
    );

    res.status(201).json({
      success: true,
      message:
        "Academic sidebar page created successfully.",
      data: {
        id: result.insertId,
        page_slug: cleanSlug,
        page_title: page_title.trim(),
        description:
          description?.trim() || "",
      },
    });
  } catch (error) {
    console.error(
      "CREATE ACADEMIC PAGE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create academic page.",
    });
  }
});

/* =========================================================
   UPDATE PAGE
========================================================= */

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      page_slug,
      page_title,
      description,
    } = req.body;

    if (!page_slug || !page_title) {
      return res.status(400).json({
        success: false,
        message:
          "Page slug and page title are required.",
      });
    }

    const cleanSlug = page_slug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    /* CHECK DUPLICATE */

    const [existing] = await db.query(
      `
      SELECT id
      FROM academic_pages
      WHERE page_slug = ?
      AND id != ?
      LIMIT 1
      `,
      [cleanSlug, id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Another page already uses this slug.",
      });
    }

    /* UPDATE */

    const [result] = await db.query(
      `
      UPDATE academic_pages
      SET
        page_slug = ?,
        page_title = ?,
        description = ?
      WHERE id = ?
      `,
      [
        cleanSlug,
        page_title.trim(),
        description?.trim() || "",
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Academic page not found.",
      });
    }

    res.json({
      success: true,
      message:
        "Academic page updated successfully.",
    });
  } catch (error) {
    console.error(
      "UPDATE ACADEMIC PAGE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update academic page.",
    });
  }
});

/* =========================================================
   GET SINGLE PAGE BY SLUG

   IMPORTANT:
   This route MUST remain AFTER /sidebar
========================================================= */

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        page_slug,
        page_title,
        description,
        created_at,
        updated_at
      FROM academic_pages
      WHERE page_slug = ?
      LIMIT 1
      `,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Academic page not found.",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(
      "GET ACADEMIC PAGE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch academic page.",
    });
  }
});

/* =========================================================
   DELETE PAGE
========================================================= */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM academic_pages
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Academic page not found.",
      });
    }

    res.json({
      success: true,
      message:
        "Academic page deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE ACADEMIC PAGE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete academic page.",
    });
  }
});

module.exports = router;