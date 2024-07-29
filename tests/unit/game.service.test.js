/* eslint-disable no-undef */
const GameService = require("../../services/game.service");
const Game = require("../../models/game.model");
const CustomError = require("../../errors/CustomError");

jest.mock("../../models/game.model");

describe("Game Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createGame", () => {
    it("should create a new game and return it", async () => {
      const newGame = { id: 1, name: "Game 1", genre: "Action", createdBy: "User1" };
      Game.createGame.mockResolvedValue(newGame);

      const result = await GameService.createGame("Game 1", "Action", "User1");

      expect(Game.createGame).toHaveBeenCalledWith("Game 1", "Action", "User1");
      expect(result).toEqual(newGame);
    });
  });

  describe("getGames", () => {
    it("should return all games", async () => {
      const games = [
        { id: 1, name: "Game 1", genre: "Action" },
        { id: 2, name: "Game 2", genre: "Puzzle" },
      ];
      Game.getAllGames.mockResolvedValue(games);

      const result = await GameService.getGames();

      expect(Game.getAllGames).toHaveBeenCalled();
      expect(result).toEqual(games);
    });
  });

  describe("getGameById", () => {
    it("should return a game by ID", async () => {
      const game = { id: 1, name: "Game 1", genre: "Action" };
      Game.getGameById.mockResolvedValue(game);

      const result = await GameService.getGameById(1);

      expect(Game.getGameById).toHaveBeenCalledWith(1);
      expect(result).toEqual(game);
    });

    it("should throw a CustomError if game not found", async () => {
      Game.getGameById.mockResolvedValue(null);

      await expect(GameService.getGameById(1)).rejects.toThrow(CustomError);
      await expect(GameService.getGameById(1)).rejects.toHaveProperty("message", "Game not found");
      await expect(GameService.getGameById(1)).rejects.toHaveProperty("status", 404);
    });
  });

  describe("updateGame", () => {
    it("should update a game and return it", async () => {
      const updatedGame = { id: 1, name: "Updated Game", genre: "Adventure" };
      Game.getGameById.mockResolvedValue(updatedGame);
      Game.updateGame.mockResolvedValue(updatedGame);

      const result = await GameService.updateGame(1, "Updated Game", "Adventure");

      expect(Game.getGameById).toHaveBeenCalledWith(1);
      expect(Game.updateGame).toHaveBeenCalledWith(1, "Updated Game", "Adventure");
      expect(result).toEqual(updatedGame);
    });

    it("should throw a CustomError if game not found", async () => {
      Game.getGameById.mockResolvedValue(null);

      await expect(GameService.updateGame(1, "Game", "Genre")).rejects.toThrow(CustomError);
      await expect(GameService.updateGame(1, "Game", "Genre")).rejects.toHaveProperty("message", "Game not found");
      await expect(GameService.updateGame(1, "Game", "Genre")).rejects.toHaveProperty("status", 404);
    });
  });

  describe("deleteGame", () => {
    it("should delete a game if it exists", async () => {
      Game.getGameById.mockResolvedValue({ id: 1, name: "Game 1", genre: "Action" });

      await GameService.deleteGame(1);

      expect(Game.getGameById).toHaveBeenCalledWith(1);
      expect(Game.deleteGame).toHaveBeenCalledWith(1);
    });

    it("should throw a CustomError if game not found", async () => {
      Game.getGameById.mockResolvedValue(null);

      await expect(GameService.deleteGame(1)).rejects.toThrow(CustomError);
      await expect(GameService.deleteGame(1)).rejects.toHaveProperty("message", "Game not found");
      await expect(GameService.deleteGame(1)).rejects.toHaveProperty("status", 404);
    });
  });
});
