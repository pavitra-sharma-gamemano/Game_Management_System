const Joi = require("joi");

const scoreSchema = Joi.object({
  score: Joi.number().min(0).required(),
  gameId: Joi.number().integer().required(),
});

module.exports = {
  scoreSchema,
};
