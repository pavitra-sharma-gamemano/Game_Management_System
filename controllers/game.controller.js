const gameService = require("../services/game.service");

exports.createGame = async (req, res, next) => {
  const { name, genre } = req.body;
  try {
    const game = await gameService.createGame(name, genre, req.user.id);
    res.status(201).json(game);
  } catch (error) {
    next(error);
  }
};

exports.getGames = async (req, res, next) => {
  try {
    const games = await gameService.getGames();
    res.json(games);
  } catch (error) {
    next(error);
  }
};

exports.getGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await gameService.getGameById(parseInt(id));
    res.json(game);
  } catch (error) {
    next(error);
  }
};

exports.updateGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, genre } = req.body;
    const game = await gameService.updateGame(parseInt(id), name, genre);
    res.json(game);
  } catch (error) {
    next(error);
  }
};

exports.deleteGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    await gameService.deleteGame(parseInt(id));
    res.json({ message: "Game deleted successfully" });
  } catch (error) {
    next(error);
  }
};
