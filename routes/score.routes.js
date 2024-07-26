const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/score.controller");
const validate = require("../middleware/validation.middleware");
const { scoreSchema } = require("../validation/score.validation");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/rbac.middleware");

router.post("/", authMiddleware, authorize("add_score"), validate(scoreSchema, "body"), scoreController.addScore);
router.get("/user", authMiddleware, scoreController.getScoresByUser);
router.get("/game/:gameId", scoreController.getScoresByGame);

module.exports = router;
