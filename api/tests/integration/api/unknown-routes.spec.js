const chai = require("chai");
const chaiHttp = require("chai-http");

const app = require("../../../app");

chai.should();
chai.use(chaiHttp);

describe("Unknown routes", () => {
  describe("GET /*", () => {
    it("it should render the index.html page for unknown routes", (done) => {
      chai
        .request(app)
        .get("/")
        .end((err, res) => {
          if (err) {
            console.error(err);
            done();
          }
          res.should.have.status(404);
          done();
        });
    });
  });
});
