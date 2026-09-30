const db = require("../config/db");
const fs = require("fs");
const path = require("path");


// =====================================================
// GET ALL
// =====================================================

exports.getNewsEvents = async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT *
            FROM news_events
            WHERE status = 1
            ORDER BY display_order ASC, id DESC
        `);

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch news events"
        });
    }
};


// =====================================================
// GET ALL ADMIN
// =====================================================

exports.getAllNewsEvents = async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT *
            FROM news_events
            ORDER BY display_order ASC, id DESC
        `);

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch news events"
        });
    }
};


// =====================================================
// GET SINGLE
// =====================================================

exports.getNewsEvent = async (req, res) => {

    try {

        const [rows] = await db.query(
            `SELECT *
             FROM news_events
             WHERE id = ?`,
            [req.params.id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                message: "News event not found"
            });
        }

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch news event"
        });
    }
};


// =====================================================
// CREATE
// =====================================================

exports.createNewsEvent = async (req, res) => {

    try {

        const {
            title,
            description,
            slug,
            link,
            status,
            display_order
        } = req.body;

        if (!title) {

            return res.status(400).json({
                message: "Title is required"
            });
        }

        const image = req.file
            ? `news-events/${req.file.filename}`
            : null;

        const [result] = await db.query(
            `INSERT INTO news_events
            (
                title,
                description,
                image,
                slug,
                link,
                status,
                display_order
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                description || "",
                image,
                slug || "",
                link || "",
                status ?? 1,
                display_order || 0
            ]
        );

        res.status(201).json({
            message: "News event created successfully",
            id: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create news event"
        });
    }
};


// =====================================================
// UPDATE
// =====================================================

exports.updateNewsEvent = async (req, res) => {

    try {

        const id = req.params.id;

        const {
            title,
            description,
            slug,
            link,
            status,
            display_order
        } = req.body;

        const [oldRows] = await db.query(
            `SELECT image
             FROM news_events
             WHERE id = ?`,
            [id]
        );

        if (oldRows.length === 0) {

            return res.status(404).json({
                message: "News event not found"
            });
        }

        let image = oldRows[0].image;

        if (req.file) {

            if (image) {

                const oldPath = path.join(
                    process.cwd(),
                    "uploads",
                    image
                );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            image = `news-events/${req.file.filename}`;
        }

        await db.query(
            `UPDATE news_events
             SET
                title = ?,
                description = ?,
                image = ?,
                slug = ?,
                link = ?,
                status = ?,
                display_order = ?
             WHERE id = ?`,
            [
                title,
                description || "",
                image,
                slug || "",
                link || "",
                status ?? 1,
                display_order || 0,
                id
            ]
        );

        res.json({
            message: "News event updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update news event"
        });
    }
};


// =====================================================
// DELETE
// =====================================================

exports.deleteNewsEvent = async (req, res) => {

    try {

        const id = req.params.id;

        const [rows] = await db.query(
            `SELECT image
             FROM news_events
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                message: "News event not found"
            });
        }

        const image = rows[0].image;

        if (image) {

            const imagePath = path.join(
                process.cwd(),
                "uploads",
                image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await db.query(
            `DELETE FROM news_events
             WHERE id = ?`,
            [id]
        );

        res.json({
            message: "News event deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to delete news event"
        });
    }
};