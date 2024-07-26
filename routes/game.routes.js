const express = require("express");
const gameController = require("../controllers/game.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/rbac.middleware");
const validate = require("../middleware/validation.middleware");
const { gameSchema, gameUpdateSchema, idSchema, emptySchema } = require("../validation/game.validation");

const router = express.Router();

router.post("/", authMiddleware, authorize("create_game"), validate(gameSchema, "body"), gameController.createGame);

router.get(
  "/",
  validate(emptySchema, "body"), // Validate empty body
  validate(emptySchema, "query"), // Validate empty query
  gameController.getGames
);

router.get(
  "/:id",
  validate(idSchema, "params"), // Validate id parameter
  validate(emptySchema, "body"), // Validate empty body
  validate(emptySchema, "query"), // Validate empty query
  gameController.getGame
);

router.put(
  "/:id",
  authMiddleware,
  authorize("update_game"),
  validate(idSchema, "params"), // Validate id parameter
  validate(gameUpdateSchema, "body"),
  gameController.updateGame
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("delete_game"),
  validate(idSchema, "params"), // Validate id parameter
  validate(emptySchema, "body"), // Validate empty body
  validate(emptySchema, "query"), // Validate empty query
  gameController.deleteGame
);

module.exports = router;
