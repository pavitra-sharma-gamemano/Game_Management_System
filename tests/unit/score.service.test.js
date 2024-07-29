/* eslint-disable no-undef */
const { addScore, getScoresByUser, getScoresByGame } = require("../../services/score.service");
const Game = require("../../models/game.model");
const Score = require("../../models/score.model");

jest.mock("../../models/game.model");
jest.mock("../../models/score.model");

describe("Score Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addScore", () => {
    it("should throw an error if score is invalid", async () => {
      await expect(addScore(-1, 1, 1)).rejects.toThrow("Invalid score value");
      await expect(addScore("invalid", 1, 1)).rejects.toThrow("Invalid score value");
    });

    it("should throw an error if gameId is invalid", async () => {
      await expect(addScore(100, "invalid", 1)).rejects.toThrow("Invalid game ID");
    });

    it("should throw an error if userId is invalid", async () => {
      await expect(addScore(100, 1, "invalid")).rejects.toThrow("Invalid user ID");
    });

    it("should throw an error if game is not found", async () => {
      Game.getGameById.mockResolvedValue(null);

      await expect(addScore(100, 1, 1)).rejects.toThrow("Game not found");
    });

    it("should add a score successfully", async () => {
      let score = 100;
      let gameId = 1;
      let userId = 1;
      Game.getGameById.mockResolvedValue({ id: 1 });
      Score.addScore.mockResolvedValue(score, gameId, userId);

      const result = await addScore(100, 1, 1);

      expect(result).toEqual(score, gameId, userId);
      expect(Game.getGameById).toHaveBeenCalledWith(1);
      expect(Score.addScore).toHaveBeenCalledWith(score, gameId, userId);
    });
  });

  describe("getScoresByUser", () => {
    it("should throw an error if userId is invalid", async () => {
      await expect(getScoresByUser("invalid")).rejects.toThrow("Invalid user ID");
    });

    it("should throw an error if scores are not found for the user", async () => {
      Score.getScoresByUser.mockResolvedValue(null);

      await expect(getScoresByUser(1)).rejects.toThrow("Scores not found for this user");
    });

    it("should return scores by user successfully", async () => {
      const scores = [{ score: 100, gameId: 1, userId: 1 }];
      Score.getScoresByUser.mockResolvedValue(scores);

      const result = await getScoresByUser(1);

      expect(result).toEqual(scores);
      expect(Score.getScoresByUser).toHaveBeenCalledWith(1);
    });
  });

  describe("getScoresByGame", () => {
    it("should throw an error if gameId is invalid", async () => {
      await expect(getScoresByGame("invalid")).rejects.toThrow("Invalid game ID");
    });

    it("should throw an error if scores are not found for the game", async () => {
      Score.getScoresByGame.mockResolvedValue(null);

      await expect(getScoresByGame(1)).rejects.toThrow("Scores not found for this game");
    });

    it("should return scores by game successfully", async () => {
      const scores = [{ score: 100, gameId: 1, userId: 1 }];
      Score.getScoresByGame.mockResolvedValue(scores);

      const result = await getScoresByGame(1);

      expect(result).toEqual(scores);
      expect(Score.getScoresByGame).toHaveBeenCalledWith(1);
    });
  });
});
