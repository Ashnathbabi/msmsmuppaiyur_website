const db = require("../config/db");


// =====================================================
// GET ABOUT HOME
// =====================================================

const getAboutHome = async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT *
            FROM about_school_home
            ORDER BY id ASC
            LIMIT 1
            `
        );

        if (rows.length === 0) {

            return res.status(200).json({
                success: true,
                data: null
            });

        }

        return res.status(200).json({

            success: true,

            data: rows[0]

        });

    } catch (error) {

        console.error(
            "GET ABOUT HOME ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to load About School"

        });

    }

};


// =====================================================
// UPDATE ABOUT HOME
// =====================================================

const updateAboutHome = async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT *
            FROM about_school_home
            ORDER BY id ASC
            LIMIT 1
            `
        );


        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "About School record not found"

            });

        }


        const existing = rows[0];


        // Keep existing images
        let main_image =
            existing.main_image || null;

        let right_image_1 =
            existing.right_image_1 || null;

        let right_image_2 =
            existing.right_image_2 || null;


        // New main image
        if (
            req.files &&
            req.files.main_image &&
            req.files.main_image[0]
        ) {

            main_image =
                req.files.main_image[0].filename;

        }


        // New right image 1
        if (
            req.files &&
            req.files.right_image_1 &&
            req.files.right_image_1[0]
        ) {

            right_image_1 =
                req.files.right_image_1[0].filename;

        }


        // New right image 2
        if (
            req.files &&
            req.files.right_image_2 &&
            req.files.right_image_2[0]
        ) {

            right_image_2 =
                req.files.right_image_2[0].filename;

        }


        await db.query(

            `
            UPDATE about_school_home
            SET

                badge_text = ?,
                title = ?,
                description = ?,
                experience_text = ?,
                mission_text = ?,

                futures_percentage = ?,
                futures_title = ?,
                futures_description = ?,

                growth_percentage = ?,
                growth_title = ?,
                growth_description = ?,

                button_text = ?,
                button_link = ?,

                main_image = ?,
                right_image_1 = ?,
                right_image_2 = ?

            WHERE id = ?
            `,

            [

                req.body.badge_text || "",
                req.body.title || "",
                req.body.description || "",
                req.body.experience_text || "",
                req.body.mission_text || "",

                req.body.futures_percentage || 0,
                req.body.futures_title || "",
                req.body.futures_description || "",

                req.body.growth_percentage || 0,
                req.body.growth_title || "",
                req.body.growth_description || "",

                req.body.button_text || "",
                req.body.button_link || "",

                main_image,
                right_image_1,
                right_image_2,

                existing.id

            ]

        );


        return res.status(200).json({

            success: true,

            message:
                "About School updated successfully",

            data: {

                main_image,
                right_image_1,
                right_image_2

            }

        });

    } catch (error) {

        console.error(
            "UPDATE ABOUT HOME ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to update About School"

        });

    }

};


module.exports = {
    getAboutHome,
    updateAboutHome
};