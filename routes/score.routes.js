const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/score.controller");
const validate = require("../middleware/validation.middleware");
const { scoreSchema, emptySchema, idSchema } = require("../validation/score.validation");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/rbac.middleware");

router.post("/", authMiddleware, authorize("add_score"), validate(scoreSchema, "body"), scoreController.addScore);
router.get("/user", authMiddleware, validate(emptySchema, "body"), validate(emptySchema, "query"), scoreController.getScoresByUser);
router.get(
  "/game/:gameId",
  validate(idSchema, "params"), // Validate id parameter
  validate(emptySchema, "body"), // Validate empty body
  validate(emptySchema, "query"), // Validate empty query
  scoreController.getScoresByGame
);

module.exports = router;
