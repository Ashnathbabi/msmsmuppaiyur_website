const db = require("../config/db");

// ==========================================
// GET PUBLIC ACTIVITIES
// ==========================================
const getActivities = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT *
            FROM activities_home
            WHERE status = 1
            ORDER BY sort_order ASC, id ASC
        `);

        res.status(200).json({
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error("Get Activities Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch activities",
            error: error.message,
        });
    }
};

// ==========================================
// GET ADMIN ACTIVITIES
// ==========================================
const getAdminActivities = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT *
            FROM activities_home
            ORDER BY sort_order ASC, id ASC
        `);

        res.status(200).json({
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error("Admin Activities Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch activities",
            error: error.message,
        });
    }
};

// ==========================================
// CREATE ACTIVITY
// ==========================================
const createActivity = async (req, res) => {
    try {
        console.log("CREATE ACTIVITY BODY:", req.body);
        console.log("CREATE ACTIVITY FILE:", req.file);

        const {
            title,
            description,
            number,
            duration,
            status,
            sort_order,
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Activity title is required",
            });
        }

        const image = req.file
            ? `uploads/activity/${req.file.filename}`
            : null;

        const activityStatus =
            status === undefined || status === ""
                ? 1
                : Number(status);

        const activityOrder =
            sort_order === undefined || sort_order === ""
                ? 0
                : Number(sort_order);

        const [result] = await db.query(
            `
            INSERT INTO activities_home
            (
                title,
                description,
                image,
                number,
                duration,
                status,
                sort_order
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                title.trim(),
                description || "",
                image,
                number || "",
                duration || "800",
                activityStatus,
                activityOrder,
            ]
        );

        const [rows] = await db.query(
            `
            SELECT *
            FROM activities_home
            WHERE id = ?
            `,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Activity added successfully",
            data: rows[0],
        });
    } catch (error) {
        console.error("Create Activity Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add activity",
            error: error.message,
        });
    }
};

// ==========================================
// UPDATE ACTIVITY
// ==========================================
const updateActivity = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("UPDATE ACTIVITY ID:", id);
        console.log("UPDATE ACTIVITY BODY:", req.body);
        console.log("UPDATE ACTIVITY FILE:", req.file);

        const {
            title,
            description,
            number,
            duration,
            status,
            sort_order,
        } = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                message: "Invalid activity ID",
            });
        }

        // Find existing activity
        const [existingRows] = await db.query(
            `
            SELECT *
            FROM activities_home
            WHERE id = ?
            `,
            [Number(id)]
        );

        if (existingRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Activity not found",
            });
        }

        const existing = existingRows[0];

        // Keep old image if no new image selected
        let image = existing.image;

        if (req.file) {
            image = `uploads/activity/${req.file.filename}`;
        }

        const activityTitle =
            title !== undefined
                ? title.trim()
                : existing.title;

        const activityDescription =
            description !== undefined
                ? description
                : existing.description;

        const activityNumber =
            number !== undefined
                ? number
                : existing.number;

        const activityDuration =
            duration !== undefined
                ? duration
                : existing.duration;

        const activityStatus =
            status !== undefined && status !== ""
                ? Number(status)
                : Number(existing.status);

        const activityOrder =
            sort_order !== undefined && sort_order !== ""
                ? Number(sort_order)
                : Number(existing.sort_order);

        if (!activityTitle) {
            return res.status(400).json({
                success: false,
                message: "Activity title is required",
            });
        }

        // Update
        const [result] = await db.query(
            `
            UPDATE activities_home
            SET
                title = ?,
                description = ?,
                image = ?,
                number = ?,
                duration = ?,
                status = ?,
                sort_order = ?
            WHERE id = ?
            `,
            [
                activityTitle,
                activityDescription || "",
                image,
                activityNumber || "",
                activityDuration || "800",
                activityStatus,
                activityOrder,
                Number(id),
            ]
        );

        console.log("UPDATE RESULT:", result);

        // Get updated row
        const [updatedRows] = await db.query(
            `
            SELECT *
            FROM activities_home
            WHERE id = ?
            `,
            [Number(id)]
        );

        res.status(200).json({
            success: true,
            message: "Activity updated successfully",
            data: updatedRows[0],
        });
    } catch (error) {
        console.error("UPDATE ACTIVITY ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update activity",
            error: error.message,
        });
    }
};

// ==========================================
// DELETE ACTIVITY
// ==========================================
const deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            `
            DELETE FROM activities_home
            WHERE id = ?
            `,
            [Number(id)]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Activity not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Activity deleted successfully",
        });
    } catch (error) {
        console.error("Delete Activity Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete activity",
            error: error.message,
        });
    }
};

module.exports = {
    getActivities,
    getAdminActivities,
    createActivity,
    updateActivity,
    deleteActivity,
};