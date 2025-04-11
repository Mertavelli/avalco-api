const {
    createNewUserController,
    loginUserController,
    sendCodeController,
    checkEmailExistingController
} = require("../controllers/authController");
const checkAuth = require("../middlewares/authMiddleware");

const router = require("express").Router();

// create new user
router.post("/register", createNewUserController);

// send Email-Code
router.post("/register/send-code", sendCodeController);

// login existing user
router.post("/login", loginUserController);

// check email already existend
router.post("/check-email", checkEmailExistingController);

module.exports = router;
