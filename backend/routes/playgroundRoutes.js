const router = require("express").Router();

const playgroundController = require("../controllers/playgroundController");

// Public on purpose: no sign-in. Abuse is limited by the per-device, per-network and daily counters.
router.get("/usage", playgroundController.usage);
router.post("/analyze", playgroundController.analyze);

module.exports = router;
