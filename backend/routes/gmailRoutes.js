
const router = require("express").Router();

const requireAuth = require("../middleware/requireAuth");
const {
    startWatch,
    getPricingThreads
} = require("../controllers/gmailController");
const settingsController = require("../controllers/gmailSettingsController");

router.post("/watch", startWatch);

router.get("/pricing-threads", getPricingThreads);

router.get("/connection", requireAuth, settingsController.connection);
router.get("/label", requireAuth, settingsController.getLabel);
router.put("/label", requireAuth, settingsController.replaceLabel);

module.exports = router;
