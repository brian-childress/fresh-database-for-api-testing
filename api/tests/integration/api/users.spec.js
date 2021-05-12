const chai = require("chai");
const chaiHttp = require("chai-http");

const dbSeeder = require("./db-seeder");
const app = require("../../../app");
const tokenService = require("../../../services/token.service");

chai.should();
chai.use(chaiHttp);

describe("Users", () => {
  before(() => {
    return new Promise(async (resolve, reject) => {
      try {
        await dbSeeder.freshDatabase();
        await dbSeeder.seedDatabase("users", "users.csv", "#");
        resolve();
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  });

  describe("GET /profile", () => {
    it("it should return a profile for a valid user", (done) => {
      const payload = {
        sub: "1", // User exists, happy path
        scopes: ["problem:read"],
      };

      tokenService
        .generateJwt(payload)
        .then((authToken) => {
          chai
            .request(app)
            .get("/profile")
            .set("Authorization", `Bearer ${authToken}`)
            .end((err, res) => {
              if (err) {
                console.error(err);
                done(err);
              }
              res.should.have.status(200);
              done();
            });
        })
        .catch((error) => {
          console.log(error);
          done(error);
        });
    });

    it("it should NOT return a profile for an invalid user", (done) => {
      const payload = {
        sub: "3", // User does not exist, happy path user not found
        scopes: ["problem:read"],
      };

      tokenService
        .generateJwt(payload)
        .then((authToken) => {
          chai
            .request(app)
            .get("/profile")
            .set("Authorization", `Bearer ${authToken}`)
            .end((err, res) => {
              if (err) {
                console.error(err);
                done(err);
              }
              res.should.have.status(404);
              done();
            });
        })
        .catch((error) => {
          console.log(error);
          done(error);
        });
    });
  });
});
