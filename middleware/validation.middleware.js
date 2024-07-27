const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      const { details } = error;
      const errors = details.map((i) => i.message); // Collect errors into an array
      return res.status(422).json({ errors }); // Change to an array format
    }
    next();
  };
};

module.exports = validate;
