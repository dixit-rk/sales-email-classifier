const router = require("express").Router();

const requireAuth = require("../middleware/requireAuth");
const statsController = require("../controllers/statsController");

router.use(requireAuth);

router.get("/", statsController.get);
router.get("/analytics", statsController.analytics);

module.exports = router;
