const CustomError = require("../errors/CustomError");
const Game = require("../models/game.model");

exports.createGame = async (name, genre, createdBy) => {
  const game = await Game.createGame(name, genre, createdBy);
  return game;
};

exports.getGames = async () => {
  const games = await Game.getAllGames();
  return games;
};

exports.getGameById = async (id) => {
  const game = await Game.getGameById(id);

  if (!game) {
    throw new CustomError("Game not found", 404);
  }

  return game;
};

exports.updateGame = async (id, name, genre) => {
  const checkGame = await Game.getGameById(id);

  if (!checkGame) {
    throw new CustomError("Game not found", 404);
  }
  const game = await Game.updateGame(id, name, genre);
  return game;
};

exports.deleteGame = async (id) => {
  const checkGame = await Game.getGameById(id);

  if (!checkGame) {
    throw new CustomError("Game not found", 404);
  }
  await Game.deleteGame(id);
};
