const scoreService = require("../services/score.service");

exports.addScore = async (req, res, next) => {
  try {
    const { score, gameId } = req.body;
    const newScore = await scoreService.addScore(req.user.id, gameId, score);
    res.status(201).send(newScore);
  } catch (error) {
    next(error);
  }
};

exports.getScoresByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const scores = await scoreService.getScoresByUser(userId);
    res.send(scores);
  } catch (error) {
    next(error);
  }
};

exports.getScoresByGame = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const scores = await scoreService.getScoresByGame(gameId);
    res.send(scores);
  } catch (error) {
    next(error);
  }
};
