/* eslint-disable no-undef */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../../services/user.service");
const User = require("../../models/user.model");

//SECTION - Mock
// Mock bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn(() => Promise.resolve("hashedPassword")),
  // eslint-disable-next-line no-unused-vars
  compare: jest.fn((password, hashedPassword) => Promise.resolve(password === "password123")),
}));

// Mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "fakeToken"),
}));

// Mock User model methods
jest.mock("../../models/user.model", () => ({
  findUsers: jest.fn(),
  createUser: jest.fn(),
  getUserViaEmail: jest.fn(),
  getUserViaId: jest.fn(),
}));
//!SECTION

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      const username = "test_user";
      const email = "test@example.com";
      const password = "password123";
      const role = "PLAYER";

      User.findUsers.mockResolvedValue([]);
      User.createUser.mockResolvedValue({
        id: 1,
        username,
        email,
        password: "hashedPassword",
        role,
      });

      const user = await userService.createUser(username, email, password, role);

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("username", username);
      expect(user).toHaveProperty("email", email);
      expect(user).toHaveProperty("role", role);
      expect(user.password).toBe("hashedPassword");

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 8);
      expect(User.createUser).toHaveBeenCalledWith(username, email, "hashedPassword", role);
    });

    it("should throw an error if email or username already exists", async () => {
      const username = "test_user";
      const email = "test@example.com";
      const password = "password123";
      const role = "PLAYER";

      User.findUsers.mockResolvedValue([{ id: 1, username, email, password: "hashedPassword", role }]);

      await expect(userService.createUser(username, email, password, role)).rejects.toThrow("Email/Username already exists");
      expect(User.findUsers).toHaveBeenCalledWith(username, email);
    });
  });

  describe("authenticateUser", () => {
    it("should authenticate user and return a token", async () => {
      const email = "test@example.com";
      const password = "password123";

      User.getUserViaEmail.mockResolvedValue({
        id: 1,
        username: "test_user",
        email,
        password: "hashedPassword",
        role: "PLAYER",
      });

      const token = await userService.authenticateUser(email, password);

      expect(token).toBe("fakeToken");
      expect(User.getUserViaEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, "hashedPassword");
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1, role: "PLAYER" }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
    });

    it("should throw an error if email or password is invalid", async () => {
      const email = "test@example.com";
      const password = "wrong_password";

      User.getUserViaEmail.mockResolvedValue(null);

      await expect(userService.authenticateUser(email, password)).rejects.toThrow("Invalid email or password");
      expect(User.getUserViaEmail).toHaveBeenCalledWith(email);

      User.getUserViaEmail.mockResolvedValue({
        id: 1,
        username: "test_user",
        email,
        password: "hashedPassword",
        role: "PLAYER",
      });

      await expect(userService.authenticateUser(email, "wrong_password")).rejects.toThrow("Invalid email or password");
      expect(bcrypt.compare).toHaveBeenCalledWith("wrong_password", "hashedPassword");
    });
  });

  describe("getUserById", () => {
    it("should return user data without password", async () => {
      const id = 1;

      User.getUserViaId.mockResolvedValue({
        id,
        username: "test_user",
        email: "test@example.com",
        password: "hashedPassword",
        role: "PLAYER",
      });

      const user = await userService.getUserById(id);

      expect(user).toHaveProperty("id", id);
      expect(user).toHaveProperty("username", "test_user");
      expect(user).toHaveProperty("email", "test@example.com");
      expect(user).not.toHaveProperty("password");
      expect(user).toHaveProperty("role", "PLAYER");
      expect(User.getUserViaId).toHaveBeenCalledWith(id);
    });

    it("should throw an error if user not found", async () => {
      const id = 1;

      User.getUserViaId.mockResolvedValue(null);

      await expect(userService.getUserById(id)).rejects.toThrow("User not found");
      expect(User.getUserViaId).toHaveBeenCalledWith(id);
    });
  });
});
