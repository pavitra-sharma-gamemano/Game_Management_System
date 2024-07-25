const prisma = require("../config/db.js");

exports.addScore = async (userId, gameId, score) => {
  const newScore = await prisma.score.create({
    data: { score, userId, gameId },
  });
  return newScore;
};

exports.getScoresByUser = async (userId) => {
  const scores = await prisma.score.findMany({ where: { userId: parseInt(userId) } });
  return scores;
};

exports.getScoresByGame = async (gameId) => {
  const scores = await prisma.score.findMany({ where: { gameId: parseInt(gameId) } });
  return scores;
};
