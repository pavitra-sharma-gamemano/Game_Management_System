const scoreService = require("../services/score.service");

exports.addScore = async (req, res, next) => {
  const { score, gameId } = req.body;
  try {
    const result = await scoreService.addScore(score, gameId, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getScoresByUser = async (req, res, next) => {
  try {
    const scores = await scoreService.getScoresByUser(req.user.id);
    res.json(scores);
  } catch (error) {
    next(error);
  }
};

exports.getScoresByGame = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const scores = await scoreService.getScoresByGame(gameId);
    res.json(scores);
  } catch (error) {
    next(error);
  }
};
