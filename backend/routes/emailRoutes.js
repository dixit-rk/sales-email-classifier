const router = require("express").Router();

const requireAuth = require("../middleware/requireAuth");
const emailController = require("../controllers/emailController");

router.use(requireAuth);

router.get("/", emailController.list);
router.get("/counts", emailController.counts);
router.post("/bulk/read", emailController.bulkRead);
router.post("/bulk/review", emailController.bulkReview);
router.get("/:id", emailController.get);

module.exports = router;
