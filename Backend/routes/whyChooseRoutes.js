const express = require("express");

const upload =
    require("../middleware/whyChooseUpload");

const {
    getWhyChoose,
    createTab,
    updateTab,
    deleteTab,
    createCounter,
    updateCounter,
    deleteCounter
} = require("../controllers/whyChooseController");

const router = express.Router();


// Get all
router.get(
    "/",
    getWhyChoose
);


// Tabs
router.post(
    "/tabs",
    upload.single("image"),
    createTab
);

router.put(
    "/tabs/:id",
    upload.single("image"),
    updateTab
);

router.delete(
    "/tabs/:id",
    deleteTab
);


// Counters
router.post(
    "/counters",
    createCounter
);

router.put(
    "/counters/:id",
    updateCounter
);

router.delete(
    "/counters/:id",
    deleteCounter
);


module.exports = router;