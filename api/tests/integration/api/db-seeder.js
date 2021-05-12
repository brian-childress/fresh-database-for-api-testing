const { exec } = require("child_process");
const { Pool } = require("pg");
const { getMostRecentFile } = require("../../db-utilities");

const service = () => {
  const requestConfig = {
    containerName: process.env.DB_HOST,
    dockerApiVersion: "v1.24",
    headers: "Content-Type: application/json",
    socket: "--unix-socket /var/run/docker.sock",
  };

  const pool = new Pool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
  });

  pool.on("error", (error, client) => {
    console.log(`DB Error: ${error.message}:${error.stack}`);
  });

  const freshDatabase = () => {
    return new Promise((resolve, reject) => {
      const mostRecentFile = getMostRecentFile("/api/database");

      if (!mostRecentFile) {
        reject("Missing database schema file");
      }

      // We're using the Docker socket to execute the lastest .sql file onto the DB Server. This allows us to have the latest DB schema available for
      // testing. If something has changed in our schema we test against it during the test execution
      exec(
        `curl ${requestConfig.socket} -H '${requestConfig.headers}' -d '{ "AttachStdout": true,  "AttachStderr": true,\
       "Cmd": ["psql", "-U", "${process.env.DB_USER}", "-f", "/tests/database/${mostRecentFile.file}"]}' -X POST http://${requestConfig.dockerApiVersion}/containers/${requestConfig.containerName}/exec`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(`db-seeder:freshDatabase():exec failed:${err}`);
            reject(err);
          }

          const execId = JSON.parse(stdout).Id;

          exec(
            `curl ${requestConfig.socket} -H '${requestConfig.headers}' -d '{"Detach": false,"Tty": false}' -X POST http://${requestConfig.dockerApiVersion}/exec/${execId}/start`,
            (err, stdout, stderr) => {
              if (err) {
                console.error(
                  `db-seeder:freshDatabase():container start failed:${err}`
                );
                reject(err);
              }
              console.log(stdout);
              resolve(stdout);
            }
          );
        }
      );
    });
  };

  const seedDatabase = (seedTableName, seedDataFile, delimiter) => {
    return new Promise((resolve, reject) => {
      delimiter = delimiter || ",";

      // The COPY command is run within the context of the DB server, through the Docker Compose setup we've,
      // copied our seed data to a directory on the DB server
      pool
        .query(
          `COPY ${seedTableName} FROM '/tests/${seedDataFile}' WITH DELIMITER '${delimiter}' CSV HEADER;`
        )
        .then((res) => {
          resolve(res.rows);
        })
        .catch((err) => {
          console.error(`db-seeder:seedDatabase():${err}`);
          reject(err);
        });
    });
  };

  return {
    freshDatabase,
    seedDatabase,
  };
};

module.exports = service();
