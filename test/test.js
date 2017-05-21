var chai = require("chai"),
    chaiHttp = require("chai-http"),
    server = require("../modules/modules").server,
    should = chai.should();

chai.use(chaiHttp);

describe("DevChat", function() {
    beforeEach(function(done) {
        done();
    })
    describe("Go to home", function() {
        it("It should go to homepage", function(done) {
            chai.request(server)
            .get("/")
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            })
        })
    });
    describe("/GET @/test/mocha", function() {
        it("It should return 200", function(done) {
            chai.request(server)
            .post("/dev/test/mocha")
            .send({
                tests: "abc"
            })
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            })
        })
    });
})