const express = require("express");

const router = express.Router();

const {
    getAboutHome,
    updateAboutHome
} = require("../controllers/aboutHomeController");

const upload =
    require("../middleware/upload");


router.get(
    "/",
    getAboutHome
);


router.put(

    "/",

    upload.fields([

        {
            name: "main_image",
            maxCount: 1
        },

        {
            name: "right_image_1",
            maxCount: 1
        },

        {
            name: "right_image_2",
            maxCount: 1
        }

    ]),

    updateAboutHome

);


module.exports = router;