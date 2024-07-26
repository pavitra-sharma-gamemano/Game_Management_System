const userService = require("../services/user.service");

exports.register = async (req, res, next) => {
  const { username, email, password, role } = req.body;
  try {
    const user = await userService.createUser(username, email, password, role);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const token = await userService.authenticateUser(email, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
