const router = require("express").Router();

const requireAuth = require("../middleware/requireAuth");
const catalogController = require("../controllers/catalogController");

router.use(requireAuth);

router.get("/", catalogController.list);
router.get("/template", catalogController.template);
router.post("/", catalogController.create);
router.post("/import", catalogController.receiveFile, catalogController.importFile);
router.delete("/:id", catalogController.remove);

module.exports = router;
