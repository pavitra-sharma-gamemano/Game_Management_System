/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/client");

describe("Score Management", () => {
  let adminToken;
  let playerToken;
  let game;
  let user;

  beforeAll(async () => {
    await prisma.user.deleteMany(); // Clear users table
    await prisma.game.deleteMany(); // Clear games table
    await prisma.score.deleteMany(); // Clear scores table

    const adminRes = await request(app).post("/users/register").send({ username: "admin", email: "admin@example.com", password: "password", role: "ADMIN" });
    const adminLoginRes = await request(app).post("/users/login").send({ email: "admin@example.com", password: "password" });
    adminToken = adminLoginRes.body.token;

    const playerRes = await request(app).post("/users/register").send({ username: "player", email: "player@example.com", password: "password", role: "PLAYER" });
    const playerLoginRes = await request(app).post("/users/login").send({ email: "player@example.com", password: "password" });
    playerToken = playerLoginRes.body.token;
    user = playerRes.body;

    const gameRes = await request(app).post("/games").set("Authorization", `Bearer ${adminToken}`).send({ name: "Game 1", genre: "Action", releaseDate: "2024-07-24" });
    game = gameRes.body;
  });

  it("should add a score for a game", async () => {
    const res = await request(app).post("/scores").set("Authorization", `Bearer ${playerToken}`).send({ score: 100, gameId: game.id });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("score", 100);
  });

  it("should get scores by user", async () => {
    const res = await request(app).get(`/scores/user/${user.id}`).set("Authorization", `Bearer ${playerToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get scores by game", async () => {
    const res = await request(app).get(`/scores/game/${game.id}`).set("Authorization", `Bearer ${playerToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
