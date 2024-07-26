const CustomError = require("../errors/CustomError");
const Game = require("../models/game.model");
const Score = require("../models/score.model");

exports.addScore = async (score, gameId, userId) => {
  const game = await Game.getGameById(gameId);

  if (!game) {
    throw new CustomError("Game not found", 404);
  }
  const result = await Score(score, gameId, userId);
  return result;
};

exports.getScoresByUser = async (userId) => {
  const scores = await Score.getScoresByUser(userId);
  return scores;
};

exports.getScoresByGame = async (gameId) => {
  const scores = await Score.getScoresByGame(gameId);
  return scores;
};
