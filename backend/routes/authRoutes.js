const router = require("express").Router();

const requireAuth = require("../middleware/requireAuth");

const {
    googleLogin,
    googleCallback,
    getMe,
    updateMe,
    logout
} = require("../controllers/authController");

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/me", getMe);
router.patch("/me", requireAuth, updateMe);
router.post("/logout", logout);

module.exports = router;