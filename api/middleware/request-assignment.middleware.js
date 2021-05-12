const { v4: uuid } = require("uuid");

// Request ID assignment and logging
const requestAssignment = (req, res, next) => {
  const reqId = uuid();
  req.reqId = reqId;
  console.info(`${reqId}:${Date.now()}:${req.originalUrl}:${req.ip}`);
  next();
};

module.exports = requestAssignment;
