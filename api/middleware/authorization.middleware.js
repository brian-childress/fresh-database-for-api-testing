const jwt = require("jsonwebtoken");

// TODO: Determine user flow, when and how to show users there was an issue with their authorization prior to redirecting
module.exports = (credentials = []) => {
  return (req, res, next) => {
    const { reqId } = req;
    // Allow for string or Array
    if (typeof credentials === "string") {
      credentials = [credentials];
    }

    // API Processing
    // Find JWT token in headers
    const tokenHeader = req.headers["authorization"];

    if (tokenHeader) {
      // Header Processing
      // Bearer yhju7uyu...
      const arrayHeader = tokenHeader.split(" ");

      if (arrayHeader[0] !== "Bearer") {
        // Invalid token type error. Token should be a 'Bearer' Token
        console.error(
          `${reqId}:authorization-middleware:invalid token type:${arrayHeader[0]}`
        );
        return res.status(401).send("Invalid token type");
      } else {
        tokenStr = arrayHeader[1];
      }
    } else {
      console.error(`${reqId}:authorization-middleware:invalid credentials`);
      return res
        .status(401)
        .send("You are not authorized to perform this action");
    }

    // Check if we have something to validate
    if (!tokenStr) {
      console.error(`${reqId}:authorization-middleware:no token provided`);
      return res.status(401).send("No token provided");
    } else {
      // Validate JWT
      jwt.verify(tokenStr, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error(
            `${reqId}:authorization-middleware:error validating jwt:${err}`
          );
          return res
            .status(401)
            .send("You are not authorized to perform this action");
        }

        if (credentials.length > 0) {
          if (
            decoded.scopes &&
            decoded.scopes.length &&
            credentials.some((cred) => decoded.scopes.indexOf(cred) >= 0)
          ) {
            req.userId = decoded.sub;
            next();
          } else {
            console.error(
              `${reqId}:authorization-middleware:error validating jwt:insufficient credentials:${decoded.scopes}:${credentials}`
            );
            return res
              .status(401)
              .send("You are not authorized to perform this action");
            // return redirectService.setCookieForState(req, res);
          }
        } else {
          // User is authenticated and there are no credentials to check for authorization
          console.info(
            `${reqId}:authorization-middleware:valid jwt:no credentials required for route, just authentication`
          );
          req.userId = decoded.sub;
          next();
        }
      });
    }
  };
};
