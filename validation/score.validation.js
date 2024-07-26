const Joi = require("joi");

const scoreSchema = Joi.object({
  score: Joi.number().min(0).required(),
  gameId: Joi.number().integer().required(),
});
const idSchema = Joi.object({
  gameId: Joi.number().integer().required(),
});

const emptySchema = Joi.object({});

module.exports = {
  scoreSchema,
  emptySchema,
  idSchema,
};
