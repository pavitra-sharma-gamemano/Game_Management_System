const Joi = require('joi');

const gameSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  genre: Joi.string().min(3).max(50).required(),
  releaseDate: Joi.date().required()
});

const gameUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  genre: Joi.string().min(3).max(50),
  releaseDate: Joi.date()
});

module.exports = {
  gameSchema,
  gameUpdateSchema
};
