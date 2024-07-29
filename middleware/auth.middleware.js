const jwt = require("jsonwebtoken");
const CustomError = require("../errors/CustomError");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  // Check for Authorization header
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return next(new CustomError("No token provided", 401));
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.getUserViaId(decoded.id);

    if (!user) {
      throw new CustomError("Authentication failed", 401);
    }

    req.user = user; // Attach user data to request
    next();
  } catch (error) {
    // Handle token verification errors
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new CustomError("Invalid token", 401));
    }

    next(new CustomError("Authentication failed", 401));
  }
};

module.exports = authMiddleware;
