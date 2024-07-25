const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/score.controller");
const validate = require("../middleware/validation.middleware");
const { scoreSchema } = require("../validation/score.validation");
const authMiddleware = require("../middleware/auth.middleware");
const rbacMiddleware = require("../middleware/rbac.middleware");

// Score Management Endpoints
router.post("/", authMiddleware, rbacMiddleware(["add_score"]), validate(scoreSchema, "body"), scoreController.addScore);
router.get("/user/:userId", authMiddleware, rbacMiddleware(["get_scores_by_user"]), scoreController.getScoresByUser);
router.get("/game/:gameId", authMiddleware, rbacMiddleware(["get_scores_by_game"]), scoreController.getScoresByGame);

module.exports = router;
