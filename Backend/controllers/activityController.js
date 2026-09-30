const db = require("../config/db");
const fs = require("fs");
const path = require("path");

/*
|--------------------------------------------------------------------------
| DELETE IMAGE FILE
|--------------------------------------------------------------------------
*/

const deleteImageFile = (imagePath) => {
  if (!imagePath) {
    return;
  }

  const cleanPath =
    imagePath.replace(
      /^[/\\]+/,
      ""
    );

  const filePath = path.join(
    __dirname,
    "..",
    cleanPath
  );

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      console.log(
        "Deleted image:",
        filePath
      );
    }
  } catch (error) {
    console.error(
      "Failed to delete image:",
      error.message
    );
  }
};

/*
|--------------------------------------------------------------------------
| GET ACTIVE ACTIVITIES
|--------------------------------------------------------------------------
*/

const getActivities = async (
  req,
  res
) => {
  try {
    const [rows] =
      await db.query(`
        SELECT
          id,
          name,
          slug,
          image,
          description,
          status,
          created_at,
          updated_at
        FROM activities
        WHERE status = 1
        ORDER BY id ASC
      `);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "getActivities error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch activities",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL ADMIN ACTIVITIES
|--------------------------------------------------------------------------
*/

const getAdminActivities =
  async (req, res) => {
    try {
      const [rows] =
        await db.query(`
          SELECT
            id,
            name,
            slug,
            image,
            description,
            status,
            created_at,
            updated_at
          FROM activities
          ORDER BY id ASC
        `);

      return res.status(200).json({
        success: true,
        data: rows,
      });
    } catch (error) {
      console.error(
        "getAdminActivities error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch activities",
      });
    }
  };

/*
|--------------------------------------------------------------------------
| GET ACTIVITY BY SLUG
|--------------------------------------------------------------------------
*/

const getActivityBySlug =
  async (req, res) => {
    try {
      const { slug } =
        req.params;

      if (!slug) {
        return res.status(400).json({
          success: false,
          message:
            "Slug is required",
        });
      }

      const [rows] =
        await db.query(
          `
          SELECT
            id,
            name,
            slug,
            image,
            description,
            status,
            created_at,
            updated_at
          FROM activities
          WHERE slug = ?
          AND status = 1
          LIMIT 1
          `,
          [slug]
        );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Activity not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: rows[0],
      });
    } catch (error) {
      console.error(
        "getActivityBySlug error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch activity",
      });
    }
  };

/*
|--------------------------------------------------------------------------
| GET ACTIVITY BY ID
|--------------------------------------------------------------------------
*/

const getActivityById =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !id ||
        isNaN(id)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid activity ID is required",
        });
      }

      const [rows] =
        await db.query(
          `
          SELECT
            id,
            name,
            slug,
            image,
            description,
            status,
            created_at,
            updated_at
          FROM activities
          WHERE id = ?
          LIMIT 1
          `,
          [id]
        );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Activity not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: rows[0],
      });
    } catch (error) {
      console.error(
        "getActivityById error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch activity",
      });
    }
  };

/*
|--------------------------------------------------------------------------
| CREATE ACTIVITY
|--------------------------------------------------------------------------
*/

const createActivity =
  async (req, res) => {
    try {
      const {
        name,
        slug,
        description,
        status,
      } = req.body;

      if (
        !name ||
        !name.trim()
      ) {
        if (req.file) {
          deleteImageFile(
            `/uploads/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message:
            "Activity name is required",
        });
      }

      if (
        !slug ||
        !slug.trim()
      ) {
        if (req.file) {
          deleteImageFile(
            `/uploads/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message:
            "Activity slug is required",
        });
      }

      let image = null;

      if (req.file) {
        image =
          `/uploads/${req.file.filename}`;
      }

      const activityStatus =
        status === undefined ||
        status === null ||
        status === ""
          ? 1
          : Number(status);

      const [result] =
        await db.query(
          `
          INSERT INTO activities
          (
            name,
            slug,
            image,
            description,
            status
          )
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            name.trim(),
            slug
              .trim()
              .toLowerCase(),
            image,
            description
              ? description.trim()
              : "",
            activityStatus,
          ]
        );

      return res.status(201).json({
        success: true,
        message:
          "Activity created successfully",

        data: {
          id: result.insertId,
          name: name.trim(),
          slug: slug
            .trim()
            .toLowerCase(),
          image,
          description:
            description
              ? description.trim()
              : "",
          status:
            activityStatus,
        },
      });
    } catch (error) {
      console.error(
        "createActivity error:",
        error
      );

      if (req.file) {
        deleteImageFile(
          `/uploads/${req.file.filename}`
        );
      }

      if (
        error.code ===
        "ER_DUP_ENTRY"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Slug already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to create activity",
        error:
          error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| UPDATE ACTIVITY
|--------------------------------------------------------------------------
*/

const updateActivity =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        name,
        slug,
        description,
        status,
      } = req.body;

      if (
        !id ||
        isNaN(id)
      ) {
        if (req.file) {
          deleteImageFile(
            `/uploads/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message:
            "Valid activity ID is required",
        });
      }

      const [oldRows] =
        await db.query(
          `
          SELECT *
          FROM activities
          WHERE id = ?
          LIMIT 1
          `,
          [id]
        );

      if (
        oldRows.length === 0
      ) {
        if (req.file) {
          deleteImageFile(
            `/uploads/${req.file.filename}`
          );
        }

        return res.status(404).json({
          success: false,
          message:
            "Activity not found",
        });
      }

      const oldActivity =
        oldRows[0];

      if (
        !name ||
        !name.trim()
      ) {
        if (req.file) {
          deleteImageFile(
            `/uploads/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message:
            "Activity name is required",
        });
      }

      if (
        !slug ||
        !slug.trim()
      ) {
        if (req.file) {
          deleteImageFile(
            `/uploads/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message:
            "Activity slug is required",
        });
      }

      let image =
        oldActivity.image;

      if (req.file) {
        image =
          `/uploads/${req.file.filename}`;
      }

      const activityStatus =
        status === undefined ||
        status === null ||
        status === ""
          ? oldActivity.status
          : Number(status);

      await db.query(
        `
        UPDATE activities
        SET
          name = ?,
          slug = ?,
          image = ?,
          description = ?,
          status = ?
        WHERE id = ?
        `,
        [
          name.trim(),
          slug
            .trim()
            .toLowerCase(),
          image,
          description
            ? description.trim()
            : "",
          activityStatus,
          id,
        ]
      );

      /*
      |--------------------------------------------------------------------------
      | DELETE OLD IMAGE
      |--------------------------------------------------------------------------
      */

      if (
        req.file &&
        oldActivity.image
      ) {
        deleteImageFile(
          oldActivity.image
        );
      }

      return res.status(200).json({
        success: true,
        message:
          "Activity updated successfully",

        data: {
          id: Number(id),
          name: name.trim(),
          slug: slug
            .trim()
            .toLowerCase(),
          image,
          description:
            description
              ? description.trim()
              : "",
          status:
            activityStatus,
        },
      });
    } catch (error) {
      console.error(
        "updateActivity error:",
        error
      );

      if (req.file) {
        deleteImageFile(
          `/uploads/${req.file.filename}`
        );
      }

      if (
        error.code ===
        "ER_DUP_ENTRY"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Slug already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to update activity",
        error:
          error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| DELETE ACTIVITY
|--------------------------------------------------------------------------
*/

const deleteActivity =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !id ||
        isNaN(id)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid activity ID is required",
        });
      }

      const [rows] =
        await db.query(
          `
          SELECT *
          FROM activities
          WHERE id = ?
          LIMIT 1
          `,
          [id]
        );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Activity not found",
        });
      }

      const activity =
        rows[0];

      await db.query(
        `
        DELETE FROM activities
        WHERE id = ?
        `,
        [id]
      );

      if (activity.image) {
        deleteImageFile(
          activity.image
        );
      }

      return res.status(200).json({
        success: true,
        message:
          "Activity deleted successfully",
      });
    } catch (error) {
      console.error(
        "deleteActivity error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete activity",
        error:
          error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = {
  getActivities,
  getAdminActivities,
  getActivityBySlug,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
};
