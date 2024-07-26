const prisma = require("../config/db.js");
const CustomError = require("../errors/CustomError");

exports.addScore = async (score, gameId, userId) => {
  const game = await prisma.game.findUnique({ where: { id: gameId } });

  if (!game) {
    throw new CustomError("Game not found", 404);
  }

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
