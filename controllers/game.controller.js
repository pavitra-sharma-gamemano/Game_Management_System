const gameService = require("../services/game.service");

exports.createGame = async (req, res, next) => {
  try {
    const { name, genre, releaseDate } = req.body;
    const game = await gameService.createGame(name, genre, releaseDate, req.user.id);
    res.status(201).send(game);
  } catch (error) {
    next(error);
  }
};

exports.getGames = async (req, res, next) => {
  try {
    const games = await gameService.getGames();
    res.send(games);
  } catch (error) {
    next(error);
  }
};

exports.getGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await gameService.getGameById(id);
    res.send(game);
  } catch (error) {
    next(error);
  }
};

exports.updateGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, genre, releaseDate } = req.body;
    const game = await gameService.updateGame(id, name, genre, releaseDate);
    res.send(game);
  } catch (error) {
    next(error);
  }
};

exports.deleteGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    await gameService.deleteGame(id);
    res.send({ message: "Game deleted successfully" });
  } catch (error) {
    next(error);
  }
};
