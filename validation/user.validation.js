const Joi = require("joi");

exports.registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("ADMIN", "PLAYER").required(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.idSchema = Joi.object({
  id: Joi.number().integer().required(),
});

exports.emptySchema = Joi.object({});
