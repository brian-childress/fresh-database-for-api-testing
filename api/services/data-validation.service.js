const service = () => {
  const validateDataAgainstSchema = (schema, dataToValidate) => {
    return new Promise((resolve, reject) => {
      const { error } = schema.validate(dataToValidate);
      const valid = error == null;
      if (dataToValidate) {
        if (valid) {
          resolve();
        } else {
          const { details } = error;
          const message = details.map((i) => i.message).join(",");

          console.error(`data-validation.service:${message}`);
          reject({ error: message });
        }
      } else {
        reject(`dataToValidate not defined`);
      }
    });
  };
  return {
    validateDataAgainstSchema,
  };
};

module.exports = service();
