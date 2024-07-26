const prisma = require("../config/db.js");

exports.addScore = async (score, gameId, userId) => {
  const result = await prisma.score.create({
    data: {
      score,
      gameId,
      userId,
    },
  });

  return result;
};

exports.getScoresByUser = async (userId) => {
  const scores = await prisma.score.findMany({ where: { userId } });
  return scores;
};

exports.getScoresByGame = async (gameId) => {
  const scores = await prisma.score.findMany({ where: { gameId } });
  return scores;
};
