const jwt = require("jsonwebtoken");

const service = () => {
  const generateJwt = (payload) => {
    return new Promise((resolve, reject) => {
      // TODO: Define information like aud, iss, expiration
      if (payload) {
        jwt.sign(payload, process.env.JWT_SECRET, (error, token) => {
          if (error) {
            console.error(`token.service:generateJwt:${error}`);
            reject("Unable to generate JWT");
          }

          resolve(token);
        });
      } else {
        console.error(`token.service:generateJwt, missing payload`);
        reject("Unable to generate JWT, payload required");
      }
    });
  };

  return { generateJwt };
};

module.exports = service();
