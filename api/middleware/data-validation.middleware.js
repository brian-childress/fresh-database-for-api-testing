const dataValidationMiddleware = (schema, property) => {
  return (req, res, next) => {
    console.log(req.body);
    const { reqId } = req;

    const { error } = schema.validate(req[property]);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      console.log(details);
      const message = details.map((i) => i.message).join(",");

      console.error(`${reqId}:dataValidationMiddleware:message`);
      res.status(422).json({ error: message });
    }
  };
};

module.exports = dataValidationMiddleware;
