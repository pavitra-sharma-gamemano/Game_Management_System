/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../app");
const prisma = require("../config/db.js");

describe("User Endpoints", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/users/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "test1234",
      role: "PLAYER",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("username", "testuser");
  });

  it("should login an existing user", async () => {
    const res = await request(app).post("/users/login").send({
      email: "test@example.com",
      password: "test1234",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should get the user profile", async () => {
    const loginRes = await request(app).post("/users/login").send({
      email: "test@example.com",
      password: "test1234",
    });
    const token = loginRes.body.token;

    const profileRes = await request(app).get("/users/profile").set("Authorization", `Bearer ${token}`);
    expect(profileRes.statusCode).toEqual(200);
    expect(profileRes.body).toHaveProperty("username", "testuser");
  });
});
