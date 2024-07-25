const { RoleAccess } = require("../config/RoleAccess");

module.exports = (allowedRoles) => (req, res, next) => {
  const userRole = req.user.role;
  if (!RoleAccess[userRole] || !allowedRoles.some((role) => RoleAccess[userRole].includes(role))) {
    return res.status(403).send({ error: "Access denied." });
  }
  next();
};
