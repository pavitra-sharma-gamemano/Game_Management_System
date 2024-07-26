const jwt = require("jsonwebtoken");
const CustomError = require("../errors/CustomError");
const prisma = require("../config/db.js");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      throw new CustomError("Authentication failed", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(new CustomError("Authentication failed", 401));
  }
};

module.exports = authMiddleware;
