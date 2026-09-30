const db = require("../config/db");
const fs = require("fs");
const path = require("path");


// =====================================================
// UPLOAD FOLDER
// =====================================================

const uploadFolder = path.join(
    process.cwd(),
    "uploads",
    "whychoose"
);


// Make sure folder exists
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, {
        recursive: true
    });
}


// =====================================================
// GET ALL WHY CHOOSE DATA
// =====================================================

const getWhyChoose = async (req, res) => {

    try {

        const [tabs] = await db.query(`
            SELECT *
            FROM why_choose_tabs
            WHERE status = 1
            ORDER BY sort_order ASC, id ASC
        `);


        const [points] = await db.query(`
            SELECT *
            FROM why_choose_points
            ORDER BY sort_order ASC, id ASC
        `);


        const [counters] = await db.query(`
            SELECT *
            FROM why_choose_counters
            WHERE status = 1
            ORDER BY sort_order ASC, id ASC
        `);


        const formattedTabs = tabs.map(tab => {

            return {
                ...tab,

                points: points.filter(
                    point =>
                        Number(point.tab_id) ===
                        Number(tab.id)
                )
            };

        });


        return res.status(200).json({

            success: true,

            tabs: formattedTabs,

            counters

        });

    } catch (error) {

        console.error(
            "Get Why Choose Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch Why Choose data",

            error:
                error.message

        });

    }

};


// =====================================================
// CREATE TAB
// =====================================================

const createTab = async (req, res) => {

    let connection;

    try {

        const {
            title,
            heading,
            description,
            extra,
            sort_order,
            points
        } = req.body;


        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (!title || !heading) {

            return res.status(400).json({

                success: false,

                message:
                    "Title and heading are required"

            });

        }


        // ---------------------------------------------
        // PARSE POINTS
        // ---------------------------------------------

        let parsedPoints = [];

        if (points) {

            try {

                parsedPoints =
                    typeof points === "string"
                        ? JSON.parse(points)
                        : points;

            } catch (error) {

                parsedPoints = [];

            }

        }


        // ---------------------------------------------
        // DATABASE CONNECTION
        // ---------------------------------------------

        connection =
            await db.getConnection();

        await connection.beginTransaction();


        // ---------------------------------------------
        // IMAGE
        // ---------------------------------------------

        const image = req.file
            ? `/uploads/whychoose/${req.file.filename}`
            : null;


        // ---------------------------------------------
        // INSERT TAB
        // ---------------------------------------------

        const [result] =
            await connection.query(
                `
                INSERT INTO why_choose_tabs
                (
                    title,
                    heading,
                    description,
                    extra,
                    image,
                    sort_order,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    title.trim(),

                    heading.trim(),

                    description
                        ? description.trim()
                        : null,

                    extra
                        ? extra.trim()
                        : null,

                    image,

                    Number(sort_order) || 0,

                    1
                ]
            );


        const tabId =
            result.insertId;


        // ---------------------------------------------
        // INSERT POINTS
        // ---------------------------------------------

        for (
            let i = 0;
            i < parsedPoints.length;
            i++
        ) {

            let point =
                parsedPoints[i];


            if (
                typeof point === "object" &&
                point !== null
            ) {

                point =
                    point.point_text;

            }


            if (
                !point ||
                !String(point).trim()
            ) {

                continue;

            }


            await connection.query(
                `
                INSERT INTO why_choose_points
                (
                    tab_id,
                    point_text,
                    sort_order
                )
                VALUES (?, ?, ?)
                `,
                [
                    tabId,

                    String(point).trim(),

                    i
                ]
            );

        }


        // ---------------------------------------------
        // COMMIT
        // ---------------------------------------------

        await connection.commit();


        return res.status(201).json({

            success: true,

            message:
                "Why Choose tab added successfully",

            id: tabId,

            image

        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }


        // If DB failed after image upload,
        // remove uploaded image
        if (req.file) {

            const uploadedFile =
                path.join(
                    uploadFolder,
                    req.file.filename
                );

            if (
                fs.existsSync(
                    uploadedFile
                )
            ) {

                fs.unlinkSync(
                    uploadedFile
                );

            }

        }


        console.error(
            "Create Why Choose Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to add tab",

            error:
                error.message

        });

    } finally {

        if (connection) {
            connection.release();
        }

    }

};


// =====================================================
// UPDATE TAB
// =====================================================

const updateTab = async (req, res) => {

    let connection;

    try {

        const { id } =
            req.params;


        const {
            title,
            heading,
            description,
            extra,
            sort_order,
            points
        } = req.body;


        // ---------------------------------------------
        // FIND EXISTING TAB
        // ---------------------------------------------

        const [existingRows] =
            await db.query(
                `
                SELECT *
                FROM why_choose_tabs
                WHERE id = ?
                `,
                [id]
            );


        if (!existingRows.length) {

            return res.status(404).json({

                success: false,

                message:
                    "Why Choose tab not found"

            });

        }


        const existing =
            existingRows[0];


        // ---------------------------------------------
        // PARSE POINTS
        // ---------------------------------------------

        let parsedPoints = [];

        if (points) {

            try {

                parsedPoints =
                    typeof points === "string"
                        ? JSON.parse(points)
                        : points;

            } catch (error) {

                parsedPoints = [];

            }

        }


        // ---------------------------------------------
        // IMAGE
        // ---------------------------------------------

        let image =
            existing.image;


        if (req.file) {

            image =
                `/uploads/whychoose/${req.file.filename}`;

        }


        // ---------------------------------------------
        // CONNECTION
        // ---------------------------------------------

        connection =
            await db.getConnection();

        await connection.beginTransaction();


        // ---------------------------------------------
        // UPDATE TAB
        // ---------------------------------------------

        await connection.query(
            `
            UPDATE why_choose_tabs
            SET
                title = ?,
                heading = ?,
                description = ?,
                extra = ?,
                image = ?,
                sort_order = ?
            WHERE id = ?
            `,
            [

                title
                    ? title.trim()
                    : "",

                heading
                    ? heading.trim()
                    : "",

                description
                    ? description.trim()
                    : null,

                extra
                    ? extra.trim()
                    : null,

                image,

                Number(sort_order) || 0,

                id

            ]
        );


        // ---------------------------------------------
        // DELETE OLD POINTS
        // ---------------------------------------------

        await connection.query(
            `
            DELETE FROM why_choose_points
            WHERE tab_id = ?
            `,
            [id]
        );


        // ---------------------------------------------
        // INSERT NEW POINTS
        // ---------------------------------------------

        for (
            let i = 0;
            i < parsedPoints.length;
            i++
        ) {

            let point =
                parsedPoints[i];


            if (
                typeof point === "object" &&
                point !== null
            ) {

                point =
                    point.point_text;

            }


            if (
                !point ||
                !String(point).trim()
            ) {

                continue;

            }


            await connection.query(
                `
               INSERT INTO why_choose_points
(
    tab_id,
    point,
    sort_order
)
VALUES (?, ?, ?)
                `,
                [

                    id,

                    String(point).trim(),

                    i

                ]
            );

        }


        // ---------------------------------------------
        // COMMIT
        // ---------------------------------------------

        await connection.commit();


        // ---------------------------------------------
        // DELETE OLD IMAGE
        // ---------------------------------------------

        if (
            req.file &&
            existing.image
        ) {

            const oldFileName =
                path.basename(
                    existing.image
                );


            const oldFilePath =
                path.join(
                    uploadFolder,
                    oldFileName
                );


            if (
                fs.existsSync(
                    oldFilePath
                )
            ) {

                fs.unlinkSync(
                    oldFilePath
                );

            }

        }


        return res.status(200).json({

            success: true,

            message:
                "Why Choose tab updated successfully",

            image

        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }


        // Remove newly uploaded image
        // if update failed
        if (req.file) {

            const uploadedFile =
                path.join(
                    uploadFolder,
                    req.file.filename
                );


            if (
                fs.existsSync(
                    uploadedFile
                )
            ) {

                fs.unlinkSync(
                    uploadedFile
                );

            }

        }


        console.error(
            "Update Why Choose Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to update tab",

            error:
                error.message

        });

    } finally {

        if (connection) {
            connection.release();
        }

    }

};


// =====================================================
// DELETE TAB
// =====================================================

const deleteTab = async (req, res) => {

    try {

        const { id } =
            req.params;


        // ---------------------------------------------
        // FIND IMAGE
        // ---------------------------------------------

        const [rows] =
            await db.query(
                `
                SELECT image
                FROM why_choose_tabs
                WHERE id = ?
                `,
                [id]
            );


        if (!rows.length) {

            return res.status(404).json({

                success: false,

                message:
                    "Why Choose tab not found"

            });

        }


        const image =
            rows[0].image;


        // ---------------------------------------------
        // DELETE TAB
        // Points will automatically delete
        // because of ON DELETE CASCADE
        // ---------------------------------------------

        await db.query(
            `
            DELETE FROM why_choose_tabs
            WHERE id = ?
            `,
            [id]
        );


        // ---------------------------------------------
        // DELETE IMAGE
        // ---------------------------------------------

        if (image) {

            const fileName =
                path.basename(image);


            const filePath =
                path.join(
                    uploadFolder,
                    fileName
                );


            if (
                fs.existsSync(
                    filePath
                )
            ) {

                fs.unlinkSync(
                    filePath
                );

            }

        }


        return res.status(200).json({

            success: true,

            message:
                "Why Choose tab deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete Why Choose Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to delete tab",

            error:
                error.message

        });

    }

};


// =====================================================
// CREATE COUNTER
// =====================================================

const createCounter = async (
    req,
    res
) => {

    try {

        const {
            number_value,
            unit,
            title,
            sort_order
        } = req.body;


        if (!title) {

            return res.status(400).json({

                success: false,

                message:
                    "Counter title is required"

            });

        }


        const [result] =
            await db.query(
                `
                INSERT INTO why_choose_counters
(
    number,
    unit,
    title,
    sort_order,
    status
)
VALUES (?, ?, ?, ?, ?)
                `,
                [

                    Number(number_value) || 0,

                    unit
                        ? unit.trim()
                        : "+",

                    title.trim(),

                    Number(sort_order) || 0,

                    1

                ]
            );


        return res.status(201).json({

            success: true,

            message:
                "Counter added successfully",

            id:
                result.insertId

        });

    } catch (error) {

        console.error(
            "Create Counter Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to add counter",

            error:
                error.message

        });

    }

};


// =====================================================
// UPDATE COUNTER
// =====================================================

const updateCounter = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;


        const {
            number_value,
            unit,
            title,
            sort_order
        } = req.body;


        if (!title) {

            return res.status(400).json({

                success: false,

                message:
                    "Counter title is required"

            });

        }


        const [result] =
            await db.query(
                `
                UPDATE why_choose_counters
SET
    number = ?,
    unit = ?,
    title = ?,
    sort_order = ?
WHERE id = ?
                `,
                [

                    Number(number_value) || 0,

                    unit
                        ? unit.trim()
                        : "+",

                    title.trim(),

                    Number(sort_order) || 0,

                    id

                ]
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Counter not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Counter updated successfully"

        });

    } catch (error) {

        console.error(
            "Update Counter Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to update counter",

            error:
                error.message

        });

    }

};


// =====================================================
// DELETE COUNTER
// =====================================================

const deleteCounter = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;


        const [result] =
            await db.query(
                `
                DELETE FROM why_choose_counters
                WHERE id = ?
                `,
                [id]
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Counter not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Counter deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete Counter Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to delete counter",

            error:
                error.message

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getWhyChoose,

    createTab,

    updateTab,

    deleteTab,

    createCounter,

    updateCounter,

    deleteCounter

};