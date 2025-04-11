const {
  getUserByUsername,
  getUsersController,
  getUserController,
} = require("../controllers/userController");
const router = require("express").Router();
const checkAuth = require("../middlewares/authMiddleware");

router.get("/single-user", checkAuth, getUserController);

router.get("/all-user", checkAuth, getUsersController);

// get user by username
router.get("/:username", checkAuth, getUserByUsername);

module.exports = router;
