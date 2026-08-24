const router = require("express").Router();
const requireAuth = require("../middleware/auth");
const { addMessage, getMessages } = require("../controllers/messageController");

router.post("/add", requireAuth, addMessage);
router.post("/get", requireAuth, getMessages);

module.exports = router;
