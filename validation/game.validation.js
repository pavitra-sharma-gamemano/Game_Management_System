const Joi = require("joi");

exports.gameSchema = Joi.object({
  name: Joi.string().required(),
  genre: Joi.string().required(),
});

exports.gameUpdateSchema = Joi.object({
  name: Joi.string().required(),
  genre: Joi.string().required(),
});

exports.idSchema = Joi.object({
  id: Joi.number().integer().required(),
});

exports.emptySchema = Joi.object({});
