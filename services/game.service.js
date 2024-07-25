const prisma = require("../config/db.js");

exports.createGame = async (name, genre, releaseDate, userId) => {
  const game = await prisma.game.create({
    data: { name, genre, releaseDate, createdById: userId },
  });
  return game;
};

exports.getGames = async () => {
  const games = await prisma.game.findMany();
  return games;
};

exports.getGameById = async (id) => {
  const game = await prisma.game.findUnique({ where: { id: parseInt(id) } });
  if (!game) throw new Error("Game not found");
  return game;
};

exports.updateGame = async (id, name, genre, releaseDate) => {
  const game = await prisma.game.update({
    where: { id: parseInt(id) },
    data: { name, genre, releaseDate },
  });
  return game;
};

exports.deleteGame = async (id) => {
  await prisma.game.delete({ where: { id: parseInt(id) } });
};
