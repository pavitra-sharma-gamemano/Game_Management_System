const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const validate = require("../middleware/validation.middleware");
const { registerSchema, loginSchema } = require("../validation/user.validation");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", validate(registerSchema, "body"), userController.register);
router.post("/login", validate(loginSchema, "body"), userController.login);
router.get("/profile", authMiddleware, userController.getProfile);

module.exports = router;
