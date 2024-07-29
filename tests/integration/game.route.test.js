/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const Game = require("../../models/game.model");
const User = require("../../models/user.model");

jest.mock("jsonwebtoken");
jest.mock("../../models/game.model");
jest.mock("../../models/user.model");

let server;
let token;

beforeAll((done) => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  process.env.JWT_SECRET = "sample";
  server = app.listen(3001, done);
  token = "fakeToken"; // Mock token
  jwt.verify.mockReturnValue({ id: 1, role: "ADMIN" }); // Mock the token verification
  User.getUserViaId.mockResolvedValue({
    id: 1,
    username: "test_user",
    email: "test@example.com",
    role: "ADMIN",
  });
});

afterAll((done) => {
  jest.restoreAllMocks();
  server.close(done);
});

describe("Game Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    token = "fakeToken"; // Mock token
    jwt.verify.mockReturnValue({ id: 1, role: "ADMIN" }); // Mock the token verification
    User.getUserViaId.mockResolvedValue({
      id: 1,
      username: "test_user",
      email: "test@example.com",
      role: "ADMIN",
    });
  });

  describe("POST /games", () => {
    it("should create a new game", async () => {
      const newGame = { id: 1, name: "Game 1", genre: "Action", createdBy: "User1" };
      Game.createGame.mockResolvedValue(newGame);

      const res = await request(app).post("/games").set("Authorization", `Bearer ${token}`).send({
        name: "Game 1",
        genre: "Action",
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(newGame);
    });

    it("should return 422 if request body is invalid", async () => {
      const res = await request(app).post("/games").set("Authorization", `Bearer ${token}`).send({
        name: "", // Invalid name
        genre: "Action",
      });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 403 if user is not authorized", async () => {
      token = jwt.sign({ id: 1, role: "PLAYER" }, process.env.JWT_SECRET); // Mock token with PLAYER role
      User.getUserViaId.mockResolvedValue({
        id: 1,
        username: "test_user",
        email: "test@example.com",
        role: "PLAYER",
      });
      const res = await request(app).post("/games").set("Authorization", `Bearer ${token}`).send({
        name: "Game 1",
        genre: "Action",
      });

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message", "Unauthorized");
    });
  });

  describe("GET /games", () => {
    it("should return all games", async () => {
      const games = [{ id: 1, name: "Game 1", genre: "Action" }];
      Game.getAllGames.mockResolvedValue(games);

      // Validate empty body and query as per your middleware
      const res = await request(app).get("/games").send({}).query({});

      expect(res.status).toBe(200);
      expect(res.body).toEqual(games);
    });

    it("should return 422 if body is not empty", async () => {
      const res = await request(app).get("/games").send({ invalidKey: "value" });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 422 if query is not empty", async () => {
      const res = await request(app).get("/games").query({ invalidKey: "value" });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty("errors");
    });
  });

  describe("GET /games/:id", () => {
    it("should return a game by ID", async () => {
      const game = { id: 1, name: "Game 1", genre: "Action" };
      Game.getGameById.mockResolvedValue(game);

      const res = await request(app).get("/games/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(game);
    });

    it("should return 404 if game not found", async () => {
      Game.getGameById.mockResolvedValue(null);

      const res = await request(app).get("/games/999");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Game not found");
    });

    it("should return 422 if ID is invalid", async () => {
      const res = await request(app).get("/games/invalid");

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty("errors");
    });
  });

  describe("PUT /games/:id", () => {
    it("should update a game", async () => {
      const updatedGame = { id: 1, name: "Updated Game", genre: "Adventure" };
      Game.getGameById.mockResolvedValue(updatedGame);
      Game.updateGame.mockResolvedValue(updatedGame);

      const res = await request(app).put("/games/1").set("Authorization", `Bearer ${token}`).send({
        name: "Updated Game",
        genre: "Adventure",
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedGame);
    });

    it("should return 403 if user is not authorized", async () => {
      token = jwt.sign({ id: 1, role: "PLAYER" }, process.env.JWT_SECRET); // Mock token with PLAYER role
      User.getUserViaId.mockResolvedValue({
        id: 1,
        username: "test_user",
        email: "test@example.com",
        role: "PLAYER",
      });
      const res = await request(app).put("/games/1").set("Authorization", `Bearer ${token}`).send({
        name: "Updated Game",
        genre: "Adventure",
      });

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message", "Unauthorized");
    });

    it("should return 404 if game not found", async () => {
      Game.getGameById.mockResolvedValue(null);

      const res = await request(app).put("/games/999").set("Authorization", `Bearer ${token}`).send({
        name: "Updated Game",
        genre: "Adventure",
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Game not found");
    });

    it("should return 422 if request body is invalid", async () => {
      const res = await request(app).put("/games/1").set("Authorization", `Bearer ${token}`).send({
        name: "", // Invalid name
        genre: "Adventure",
      });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty("errors");
    });
  });

  //   describe("DELETE /games/:id", () => {
  //     it("should delete a game", async () => {
  //       Game.getGameById.mockResolvedValue({ id: 1, name: "Game 1", genre: "Action" });

  //       const res = await request(app).delete("/games/1").set("Authorization", `Bearer ${token}`);

  //       expect(res.status).toBe(204);
  //     });

  //     it("should return 403 if user is not authorized", async () => {
  //       token = jwt.sign({ id: 1, role: "PLAYER" }, process.env.JWT_SECRET); // Mock token with PLAYER role

  //       const res = await request(app).delete("/games/1").set("Authorization", `Bearer ${token}`);

  //       expect(res.status).toBe(403);
  //       expect(res.body).toHaveProperty("message", "Unauthorized");
  //     });

  //     it("should return 404 if game not found", async () => {
  //       Game.getGameById.mockResolvedValue(null);

  //       const res = await request(app).delete("/games/999").set("Authorization", `Bearer ${token}`);

  //       expect(res.status).toBe(404);
  //       expect(res.body).toHaveProperty("message", "Game not found");
  //     });

  //     it("should return 422 if ID is invalid", async () => {
  //       const res = await request(app).delete("/games/invalid").set("Authorization", `Bearer ${token}`);

  //       expect(res.status).toBe(422);
  //       expect(res.body).toHaveProperty("errors");
  //     });
  //   });
});
