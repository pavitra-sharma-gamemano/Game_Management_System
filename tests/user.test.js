/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/client");

describe("User Management", () => {
  let token;

  beforeAll(async () => {
    await prisma.user.deleteMany(); // Clear users table
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/users/register").send({ username: "admin", email: "admin@example.com", password: "password", role: "ADMIN" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should login and get a JWT token", async () => {
    const res = await request(app).post("/users/login").send({ email: "admin@example.com", password: "password" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should get user profile", async () => {
    const res = await request(app).get("/users/profile").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("email", "admin@example.com");
  });
});
