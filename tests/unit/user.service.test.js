const bcrypt = require("bcryptjs");
const prisma = require("../../config/db");
const userService = require("../../src/services/user.service");

describe("User Service", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      const username = "testuser";
      const email = "test@example.com";
      const password = "test1234";
      const role = "PLAYER";

      const user = await userService.createUser(username, email, password, role);

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("username", username);
      expect(user).toHaveProperty("email", email);
      expect(user.password).not.toBe(password); // Password should be hashed
    });

    it("should throw an error if email already exists", async () => {
      const username = "testuser";
      const email = "test@example.com";
      const password = "test1234";
      const role = "PLAYER";

      await userService.createUser(username, email, password, role);

      await expect(userService.createUser(username, email, password, role)).rejects.toThrow("Email/Username already exist");
    });
  });

  // Add more unit tests for other service functions
});
