const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db.js");
const CustomError = require("../errors/CustomError");

exports.createUser = async (username, email, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 8);
  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword, role },
  });
  return user;
};

exports.authenticateUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new CustomError("Invalid login credentials", 401);
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  return token;
};

exports.getUserById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
};
