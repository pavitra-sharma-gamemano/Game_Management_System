const CustomError = require("../errors/CustomError");
const { RoleAccess } = require("../config/RoleAccess");

const authorize = (action) => {
  return (req, res, next) => {
    if (RoleAccess[req.user.role].includes(action)) {
      return next();
    }
    next(new CustomError("Unauthorized", 403));
  };
};

module.exports = authorize;
