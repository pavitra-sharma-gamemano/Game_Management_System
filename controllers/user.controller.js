const userService = require("../services/user.service");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await userService.createUser(username, email, password, role);
    res.status(201).send(user);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await userService.authenticateUser(email, password);
    res.send({ token });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.send(user);
  } catch (error) {
    next(error);
  }
};
