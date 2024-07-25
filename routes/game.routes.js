const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");
const authMiddleware = require("../middleware/auth.middleware");
const rbacMiddleware = require("../middleware/rbac.middleware");

// Game Management Endpoints
router.post("/", authMiddleware, rbacMiddleware(["create_game"]), gameController.createGame);
router.get("/", authMiddleware, rbacMiddleware(["get_games"]), gameController.getGames);
router.get("/:id", authMiddleware, rbacMiddleware(["get_game"]), gameController.getGame);
router.put("/:id", authMiddleware, rbacMiddleware(["update_game"]), gameController.updateGame);
router.delete("/:id", authMiddleware, rbacMiddleware(["delete_game"]), gameController.deleteGame);

module.exports = router;
