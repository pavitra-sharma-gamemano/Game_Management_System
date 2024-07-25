const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      console.error("error", message);
      res.status(422).json({ error: message });
    } else {
      next();
    }
  };
};

module.exports = validate;
