/* eslint-disable no-undef */
const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const app = require("../../app");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../models/user.model");

let server;

beforeAll((done) => {
  // Suppress console.error during tests
  jest.spyOn(console, "error").mockImplementation(() => {});
  process.env.JWT_SECRET = "sample";
  server = app.listen(3001, done); // Start server on a different port
});

afterAll((done) => {
  jest.restoreAllMocks();
  server.close(done); // Ensure the server is closed after tests
});

describe("User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /users/register", () => {
    it("should register a new user", async () => {
      User.findUsers.mockResolvedValue([]);
      User.createUser.mockResolvedValue({
        id: 1,
        username: "test_user",
        email: "test@example.com",
        password: "hashedPassword",
        role: "PLAYER",
      });
      bcrypt.hash.mockResolvedValue("hashedPassword");

      const res = await request(app).post("/users/register").send({
        username: "test_user",
        email: "test@example.com",
        password: "password123",
        role: "PLAYER",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("username", "test_user");
      expect(res.body).toHaveProperty("email", "test@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 8);
      expect(User.createUser).toHaveBeenCalledWith("test_user", "test@example.com", "hashedPassword", "PLAYER");
    });

    it("should return 400 if email or username already exists", async () => {
      User.findUsers.mockResolvedValue([{ id: 1, username: "test_user", email: "test@example.com" }]);

      const res = await request(app).post("/users/register").send({
        username: "test_user",
        email: "test@example.com",
        password: "password123",
        role: "PLAYER",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Email/Username already exists");
      expect(User.findUsers).toHaveBeenCalledWith("test_user", "test@example.com");
    });

    it("should return 422 if request body is invalid", async () => {
      const res = await request(app).post("/users/register").send({
        username: "test_user",
        email: "invalid-email",
        password: "password123",
        role: "PLAYER",
      });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty("errors");
    });
  });

  describe("POST /users/login", () => {
    it("should login a user and return a token", async () => {
      User.getUserViaEmail.mockResolvedValue({
        id: 1,
        username: "test_user",
        email: "test@example.com",
        password: "hashedPassword",
        role: "PLAYER",
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fakeToken");

      const res = await request(app).post("/users/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token", "fakeToken");
      expect(User.getUserViaEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1, role: "PLAYER" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    });

    it("should return 401 if email or password is incorrect", async () => {
      User.getUserViaEmail.mockResolvedValue(null);

      const res = await request(app).post("/users/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid email or password");
      expect(User.getUserViaEmail).toHaveBeenCalledWith("test@example.com");
    });

    it("should return 422 if request body is invalid", async () => {
      const res = await request(app).post("/users/login").send({
        email: "test@example.com",
      });

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty("errors");
    });
  });

  describe("GET /users/profile", () => {
    it("should return the user profile", async () => {
      const token = "Bearer fakeToken";
      jwt.verify.mockReturnValue({ id: 1, role: "PLAYER" }); // Mock the token verification

      User.getUserViaId.mockResolvedValue({
        id: 1,
        username: "test_user",
        email: "test@example.com",
        role: "PLAYER",
      });

      const res = await request(app).get("/users/profile").set("Authorization", token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("username", "test_user");
      expect(res.body).toHaveProperty("email", "test@example.com");
    });

    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/users/profile");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "No token provided");
    });
  });
});
