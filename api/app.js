const express = require("express");
const cors = require("cors");

const authorize = require("./middleware/authorization.middleware");
const requestAssignmentMiddleware = require("./middleware/request-assignment.middleware");
const db = require("./db/index");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const whitelist = [
  "http://localhost:8080",
  "http://localhost:8000",
  "http://127.0.0.1:8080",
  "http://localhost:4444",
]; // TODO: Deal with undefined when on localhost
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(requestAssignmentMiddleware);
app.use(cors(corsOptions));
app.use(express.json());

// Overriding default NODE_ENV, defaulting to production behavior
process.env.NODE_ENV = process.env.NODE_ENV || "production";

process
  .on("unhandledRejection", (error, p) => {
    // Will print "unhandledRejection err is not defined"
    console.error(`${Date.now()}:app:unhandledRejection:${error}`);
  })
  .on("uncaughtException", (error) => {
    // do a graceful shutdown,
    // close the database connection etc.
    console.error(`${Date.now()}:app:uncaughtException:${error}`);
    process.exit(1);
  });

app.get("/profile", authorize(), (req, res) => {
  const { reqId, userId } = req;
  db.query(
    reqId,
    `SELECT email_address, first_name, family_name FROM users WHERE user_id = $1`,
    [userId]
  )
    .then((response) => {
      if (response.length > 0) {
        res.json(response);
      } else {
        res.status(404).send(`Profile not found`);
      }
    })
    .catch((error) => {
      console.error(`${reqId}:error getting profile:${error}`);
      res.status(400).send(`Error getting profile`);
    });
});

// Handle unknown routes
app.use("*", (req, res, next) => {
  console.error(`${req.reqId}:Unknown route`);
  res.status(404).send("Unknown route");
});

const server = app.listen(port, () => {
  console.info(
    `${Date.now()}:Server is listening on port ${server.address().port}`
  );
});

module.exports = server;
