const prisma = require("../config/db.js");

exports.createGame = async (name, genre, userId) => {
  const game = await prisma.game.create({
    data: {
      name,
      genre,
      userId,
    },
  });

  return game;
};

exports.updateGame = async (id, name, genre) => {
  const game = await prisma.game.update({
    where: { id },
    data: {
      name,
      genre,
    },
  });

  return game;
};

exports.getAllGames = async () => {
  const games = await prisma.game.findMany();
  return games;
};

exports.getGameById = async (id) => {
  const game = (await prisma.game.findUnique({ where: { id } })) || null;
  return game;
};

exports.deleteGame = async (id) => {
  const game = (await prisma.game.delete({ where: { id } })) || null;
  return game;
};
