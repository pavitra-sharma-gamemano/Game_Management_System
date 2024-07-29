const CustomError = require("../errors/CustomError");
const Game = require("../models/game.model");

exports.createGame = async (name, genre, createdBy) => {
  return await Game.createGame(name, genre, createdBy);
};

exports.getGames = async () => {
  return await Game.getAllGames();
};

exports.getGameById = async (id) => {
  const game = await Game.getGameById(id);
  if (!game) {
    throw new CustomError("Game not found", 404);
  }
  return game;
};

exports.updateGame = async (id, name, genre) => {
  const existingGame = await Game.getGameById(id);
  if (!existingGame) {
    throw new CustomError("Game not found", 404);
  }
  return await Game.updateGame(id, name, genre);
};

exports.deleteGame = async (id) => {
  const existingGame = await Game.getGameById(id);
  if (!existingGame) {
    throw new CustomError("Game not found", 404);
  }
  await Game.deleteGame(id);
};
