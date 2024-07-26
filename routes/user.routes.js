const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const { registerSchema, loginSchema, emptySchema } = require("../validation/user.validation");

const router = express.Router();

router.post("/register", validate(registerSchema, "body"), userController.register);
router.post("/login", validate(loginSchema, "body"), userController.login);
router.get("/profile", authMiddleware, validate(emptySchema, "body"), validate(emptySchema, "query"), userController.getProfile);

module.exports = router;
