const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CustomError = require("../errors/CustomError");
const User = require("../models/user.model");

exports.createUser = async (username, email, password, role) => {
  const existingUser = await User.findUsers(username, email);

  if (existingUser.length) {
    throw new CustomError("Email/Username already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const user = await User.createUser(username, email, hashedPassword, role);
  return user;
};

exports.authenticateUser = async (email, password) => {
  const user = await User.getUserViaEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new CustomError("Invalid email or password", 401);
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

exports.getUserById = async (id) => {
  const user = await User.getUserViaId(id);

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  // eslint-disable-next-line no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
