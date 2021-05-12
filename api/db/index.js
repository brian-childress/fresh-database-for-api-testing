const { Pool } = require("pg");

const pool = new Pool({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
});

pool.on("error", (error, client) => {
  console.error(`DB Error: ${error.message}:${error.stack}`);
});

module.exports = {
  query: (reqId, query, params) => {
    return new Promise((resolve, reject) => {
      if (!reqId) {
        console.error(`DB query Error: reqId not defined`);
        reject(`reqId not defined`);
      } else if (!query) {
        console.error(`${reqId}:DB query Error: query not defined`);
        reject(`query not defined`);
      } else {
        console.info(`${reqId}:DB query:${query}`);
        pool
          .query(query, params)
          .then((res) => {
            resolve(res.rows);
          })
          .catch((error) => {
            console.error(`${reqId}:DB query Error: ${error}`);
            reject(error);
          });
      }
    });
  },
};
