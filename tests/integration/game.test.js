/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../../app");
const prisma = require("../../config/db");

describe("Game Management", () => {
  let adminToken;
  let game;

  beforeAll(async () => {
    await prisma.user.deleteMany(); // Clear users table
    await prisma.game.deleteMany(); // Clear games table

    const res = await request(app).post("/users/register").send({ username: "admin", email: "admin@example.com", password: "password", role: "ADMIN" });
    const loginRes = await request(app).post("/users/login").send({ email: "admin@example.com", password: "password" });
    adminToken = loginRes.body.token;
  });

  it("should create a new game", async () => {
    const res = await request(app).post("/games").set("Authorization", `Bearer ${adminToken}`).send({ name: "Game 1", genre: "Action", releaseDate: "2024-07-24" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    game = res.body;
  });

  it("should get all games", async () => {
    const res = await request(app).get("/games").set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get a game by ID", async () => {
    const res = await request(app).get(`/games/${game.id}`).set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name", "Game 1");
  });

  it("should update a game", async () => {
    const res = await request(app).put(`/games/${game.id}`).set("Authorization", `Bearer ${adminToken}`).send({ name: "Updated Game 1", genre: "Adventure", releaseDate: "2024-07-24" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name", "Updated Game 1");
  });

  it("should delete a game", async () => {
    const res = await request(app).delete(`/games/${game.id}`).set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Game deleted successfully");
  });
});
