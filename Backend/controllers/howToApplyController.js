const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const uploadFolder = path.join(
    process.cwd(),
    "uploads",
    "howtoapply"
);

// Create upload folder automatically
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, {
        recursive: true
    });
}


// =====================================================
// GET ALL DATA
// =====================================================

exports.getHowToApply = async (req, res) => {
    try {

        const [settings] = await db.query(`
            SELECT *
            FROM how_to_apply_settings
            WHERE id = 1
            LIMIT 1
        `);

        const [steps] = await db.query(`
            SELECT *
            FROM how_to_apply
            ORDER BY id ASC
        `);

        const [facilities] = await db.query(`
            SELECT *
            FROM how_to_apply_facilities
            WHERE status = 1
            ORDER BY sort_order ASC, id ASC
        `);

        res.status(200).json({
            success: true,
            settings: settings[0] || null,
            steps: steps || [],
            facilities: facilities || []
        });

    } catch (error) {

        console.error(
            "GET HOW TO APPLY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load How To Apply data"
        });
    }
};


// =====================================================
// UPDATE SETTINGS
// =====================================================

exports.updateSettings = async (req, res) => {
    try {
        const {
            badge_title,
            heading
        } = req.body;

        const [existing] = await db.query(
            `
            SELECT id
            FROM how_to_apply_settings
            WHERE id = 1
            LIMIT 1
            `
        );

        if (existing.length === 0) {

            await db.query(
                `
                INSERT INTO how_to_apply_settings
                (
                    id,
                    badge_title,
                    heading,
                    center_image
                )
                VALUES
                (
                    1,
                    ?,
                    ?,
                    ''
                )
                `,
                [
                    badge_title || "",
                    heading || ""
                ]
            );

        } else {

            await db.query(
                `
                UPDATE how_to_apply_settings
                SET
                    badge_title = ?,
                    heading = ?
                WHERE id = 1
                `,
                [
                    badge_title || "",
                    heading || ""
                ]
            );
        }

        res.json({
            success: true,
            message: "Settings updated successfully"
        });

    } catch (error) {

        console.error(
            "UPDATE SETTINGS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update settings"
        });
    }
};


// =====================================================
// UPLOAD CENTER IMAGE
// =====================================================

exports.uploadCenterImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const imagePath =
            `/uploads/howtoapply/${req.file.filename}`;

        // Check settings row
        const [existing] = await db.query(
            `
            SELECT id
            FROM how_to_apply_settings
            WHERE id = 1
            LIMIT 1
            `
        );

        if (existing.length === 0) {

            await db.query(
                `
                INSERT INTO how_to_apply_settings
                (
                    id,
                    badge_title,
                    heading,
                    center_image
                )
                VALUES
                (
                    1,
                    '',
                    '',
                    ?
                )
                `,
                [imagePath]
            );

        } else {

            await db.query(
                `
                UPDATE how_to_apply_settings
                SET center_image = ?
                WHERE id = 1
                `,
                [imagePath]
            );
        }

        res.json({
            success: true,
            message: "Center image uploaded successfully",
            image: imagePath
        });

    } catch (error) {
        console.error(
            "CENTER IMAGE ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Center image upload failed"
        });
    }
};


// =====================================================
// ADD STEP
// =====================================================

exports.addStep = async (req, res) => {

    try {

        const {
            step_number,
            title,
            description
        } = req.body;

        if (
            !step_number ||
            !title ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO how_to_apply
            (
                step_number,
                title,
                description
            )
            VALUES (?, ?, ?)
            `,
            [
                step_number,
                title,
                description
            ]
        );

        res.json({
            success: true,
            message: "Step added successfully",
            id: result.insertId
        });

    } catch (error) {

        console.error(
            "ADD STEP ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to add step"
        });
    }
};


// =====================================================
// UPDATE STEP
// =====================================================

exports.updateStep = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            step_number,
            title,
            description
        } = req.body;

        await db.query(
            `
            UPDATE how_to_apply
            SET
                step_number = ?,
                title = ?,
                description = ?
            WHERE id = ?
            `,
            [
                step_number,
                title,
                description,
                id
            ]
        );

        res.json({
            success: true,
            message: "Step updated successfully"
        });

    } catch (error) {

        console.error(
            "UPDATE STEP ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update step"
        });
    }
};


// =====================================================
// DELETE STEP
// =====================================================

exports.deleteStep = async (req, res) => {

    try {

        const { id } = req.params;

        await db.query(
            `
            DELETE FROM how_to_apply
            WHERE id = ?
            `,
            [id]
        );

        res.json({
            success: true,
            message: "Step deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE STEP ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete step"
        });
    }
};


// =====================================================
// ADD FACILITY
// =====================================================

exports.addFacility = async (req, res) => {

    try {

        const {
            title,
            link,
            sort_order
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        let image = null;

        if (req.file) {
            image =
                `/uploads/howtoapply/${req.file.filename}`;
        }

        const [result] = await db.query(
            `
            INSERT INTO how_to_apply_facilities
            (
                title,
                image,
                link,
                sort_order
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                title,
                image,
                link || null,
                sort_order || 0
            ]
        );

        res.json({
            success: true,
            message: "Facility added successfully",
            id: result.insertId
        });

    } catch (error) {

        console.error(
            "ADD FACILITY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to add facility"
        });
    }
};


// =====================================================
// UPDATE FACILITY
// =====================================================

exports.updateFacility = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            link,
            sort_order,
            status
        } = req.body;

        let sql = `
            UPDATE how_to_apply_facilities
            SET
                title = ?,
                link = ?,
                sort_order = ?,
                status = ?
        `;

        const params = [
            title,
            link || null,
            sort_order || 0,
            status ?? 1
        ];

        if (req.file) {

            sql += `,
                image = ?
            `;

            params.push(
                `/uploads/howtoapply/${req.file.filename}`
            );
        }

        sql += `
            WHERE id = ?
        `;

        params.push(id);

        await db.query(sql, params);

        res.json({
            success: true,
            message: "Facility updated successfully"
        });

    } catch (error) {

        console.error(
            "UPDATE FACILITY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update facility"
        });
    }
};


// =====================================================
// DELETE FACILITY
// =====================================================

exports.deleteFacility = async (req, res) => {

    try {

        const { id } = req.params;

        await db.query(
            `
            DELETE FROM how_to_apply_facilities
            WHERE id = ?
            `,
            [id]
        );

        res.json({
            success: true,
            message: "Facility deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE FACILITY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete facility"
        });
    }
};