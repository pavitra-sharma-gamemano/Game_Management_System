/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../../app.js");
const prisma = require("../../config/db.js");

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
const request = require("supertest");
const app = require("../../src/app");
const prisma = require("../../src/config/db.config");

describe("User Routes", () => {
  let token;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /users/register", () => {
    it("should register a user successfully", async () => {
      const res = await request(app).post("/users/register").send({
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
        role: "PLAYER",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("username", "newuser");
      expect(res.body).toHaveProperty("email", "newuser@example.com");
      expect(res.body).not.toHaveProperty("password"); // Ensure password is not returned
    });

    it("should return 400 for duplicate email", async () => {
      await request(app).post("/users/register").send({
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
        role: "PLAYER",
      });

      const res = await request(app).post("/users/register").send({
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
        role: "PLAYER",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "Email/Username already exist");
    });
  });

  describe("POST /users/login", () => {
    it("should login a user successfully", async () => {
      const res = await request(app).post("/users/login").send({
        email: "newuser@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
      token = res.body.token; // Save token for authenticated tests
    });

    it("should return 401 for invalid credentials", async () => {
      const res = await request(app).post("/users/login").send({
        email: "newuser@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });
  });

  describe("GET /users/profile", () => {
    it("should return user profile for authenticated user", async () => {
      const res = await request(app).get("/users/profile").set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("username", "newuser");
    });

    it("should return 401 for unauthenticated user", async () => {
      const res = await request(app).get("/users/profile");

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("message", "Authentication required");
    });
  });

  // Add more integration tests for other routes
});
