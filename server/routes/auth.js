const router = require("express").Router();
const requireAuth = require("../middleware/auth");
const {
  register,
  login,
  setAvatar,
  getContacts,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/set-avatar", requireAuth, setAvatar);
router.get("/contacts", requireAuth, getContacts);

module.exports = router;
