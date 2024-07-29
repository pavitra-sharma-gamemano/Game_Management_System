/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const Score = require("../../models/score.model");
const Game = require("../../models/game.model");
const User = require("../../models/user.model");

jest.mock("jsonwebtoken");
jest.mock("../../models/score.model");
jest.mock("../../models/game.model");
jest.mock("../../models/user.model");

let server;
let token;

beforeAll((done) => {
  // Suppress console.error during tests
  jest.spyOn(console, "error").mockImplementation(() => {});
  process.env.JWT_SECRET = "sample";
  server = app.listen(3001, done); // Start server on a different port
  token = "fakeToken";
  jwt.verify.mockReturnValue({ id: 1, role: "PLAYER" }); // Mock the token verification
});

afterAll((done) => {
  jest.restoreAllMocks();
  server.close(done); // Ensure the server is closed after tests
});

describe("Score Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /scores", () => {
    it("should add a new score for PLAYER role", async () => {
      User.getUserViaId.mockResolvedValue({
        id: 1,
        username: "test_user",
        email: "test@example.com",
        role: "PLAYER",
      });

      const score = 100;
      const gameId = 1;
      const userId = 1;

      Game.getGameById.mockResolvedValue({ id: gameId });
      Score.addScore.mockResolvedValue({ score, gameId, userId });

      const res = await request(app).post("/scores").set("Authorization", `Bearer ${token}`).send({
        score,
        gameId,
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("score", score);
      expect(res.body).toHaveProperty("gameId", gameId);
      expect(res.body).toHaveProperty("userId", userId);
    });

    it("should return 422 if request body is invalid", async () => {
      const res = await request(app).post("/scores").set("Authorization", `Bearer ${token}`).send({
        score: "invalid",
        gameId: "invalid",
      });

      expect(res.status).toBe(422);
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).post("/scores").send({
        score: 100,
        gameId: 1,
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "No token provided");
    });

    it("should return 404 if game not found", async () => {
      Game.getGameById.mockResolvedValue(null);

      const res = await request(app).post("/scores").set("Authorization", `Bearer ${token}`).send({
        score: 100,
        gameId: 1,
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Game not found");
    });

    it("should return 403 if role is not allowed to add a score", async () => {
      User.getUserViaId.mockResolvedValue({
        id: 2,
        username: "admin",
        email: "admin@example.com",
        role: "ADMIN",
      });

      token = "fakeTokenAdmin"; // Simulate an admin token
      jwt.verify.mockReturnValue({ id: 2, role: "ADMIN" }); // Mock the token verification for admin

      const score = 100;
      const gameId = 1;

      const res = await request(app).post("/scores").set("Authorization", `Bearer ${token}`).send({
        score,
        gameId,
      });

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message", "Unauthorized");
    });
  });

  describe("GET /scores/user", () => {
    it("should return scores for the user", async () => {
      const scores = [{ score: 100, gameId: 1, userId: 1 }];
      Score.getScoresByUser.mockResolvedValue(scores);

      const res = await request(app).get("/scores/user").set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(scores);
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get("/scores/user");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "No token provided");
    });

    it("should return 404 if scores are not found for the user", async () => {
      Score.getScoresByUser.mockResolvedValue(null);

      const res = await request(app).get("/scores/user").set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Scores not found for this user");
    });
  });

  describe("GET /scores/game/:gameId", () => {
    it("should return scores for the game", async () => {
      const scores = [{ score: 100, gameId: 1, userId: 1 }];
      Score.getScoresByGame.mockResolvedValue(scores);

      const res = await request(app).get("/scores/game/1").set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(scores);
    });

    it("should return 422 if gameId is invalid", async () => {
      const res = await request(app).get("/scores/game/invalid").set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get("/scores/game/1");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "No token provided");
    });

    it("should return 404 if scores are not found for the game", async () => {
      Score.getScoresByGame.mockResolvedValue(null);

      const res = await request(app).get("/scores/game/1").set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Scores not found for this game");
    });
  });
});
