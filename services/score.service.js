const CustomError = require("../errors/CustomError");
const Game = require("../models/game.model");
const Score = require("../models/score.model");

exports.addScore = async (score, gameId, userId) => {
  // Validate input parameters
  if (typeof score !== "number" || score < 0) {
    throw new CustomError("Invalid score value", 400);
  }
  if (!gameId || typeof gameId !== "number") {
    throw new CustomError("Invalid game ID", 400);
  }
  if (!userId || typeof userId !== "number") {
    throw new CustomError("Invalid user ID", 400);
  }

  const game = await Game.getGameById(gameId);

  if (!game) {
    throw new CustomError("Game not found", 404);
  }
  const result = await Score.addScore(score, gameId, userId);
  return result;
};

exports.getScoresByUser = async (userId) => {
  if (!userId || typeof userId !== "number") {
    throw new CustomError("Invalid user ID", 400);
  }

  const scores = await Score.getScoresByUser(userId);

  if (!scores) {
    throw new CustomError("Scores not found for this user", 404);
  }

  return scores;
};

exports.getScoresByGame = async (gameId) => {
  if (!gameId || typeof gameId !== "number") {
    throw new CustomError("Invalid game ID", 400);
  }

  const scores = await Score.getScoresByGame(gameId);

  if (!scores) {
    throw new CustomError("Scores not found for this game", 404);
  }

  return scores;
};
