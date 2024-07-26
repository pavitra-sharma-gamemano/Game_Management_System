const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      return res.status(422).json({ error: message });
    }
    next();
  };
};

module.exports = validate;
