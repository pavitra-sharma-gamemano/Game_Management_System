const prisma = require("../config/db");

exports.findUsers = async (username, email) => {
  const Users = await prisma.user.findMany({
    where: {
      OR: [{ email }, { username }],
    },
  });

  return Users;
};

exports.createUser = async (username, email, password, role) => {
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password,
      role,
    },
  });

  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

exports.getUserViaEmail = async (email) => {
  const user = (await prisma.user.findUnique({ where: { email } })) || null;
  return user;
};

exports.getUserViaId = async (id) => {
  const user = (await prisma.user.findUnique({ where: { id } })) || null;
  return user;
};
