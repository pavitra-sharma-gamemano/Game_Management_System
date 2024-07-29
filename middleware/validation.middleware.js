const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      const { details } = error;
      const errors = details.map((i) => i.message);
      return res.status(422).json({ errors });
    }
    next();
  };
};

module.exports = validate;
