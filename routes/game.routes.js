const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");
const validate = require("../middleware/validation.middleware");
const { gameSchema, gameUpdateSchema } = require("../validation/game.validation");
const authMiddleware = require("../middleware/auth.middleware");
const rbacMiddleware = require("../middleware/rbac.middleware");

// Game Management Endpoints
router.post("/", authMiddleware, rbacMiddleware(["create_game"]), validate(gameSchema, "body"), gameController.createGame);
router.get("/", authMiddleware, rbacMiddleware(["get_games"]), gameController.getGames);
router.get("/:id", authMiddleware, rbacMiddleware(["get_game"]), gameController.getGame);
router.put("/:id", authMiddleware, rbacMiddleware(["update_game"]), validate(gameUpdateSchema, "body"), gameController.updateGame);
router.delete("/:id", authMiddleware, rbacMiddleware(["delete_game"]), gameController.deleteGame);

module.exports = router;
