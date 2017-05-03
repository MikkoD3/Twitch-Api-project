var request = require("request"),
    assert = require("assert"),
    helloWorld = require('../server.js');
    base_url = "http://localhost:8081"

describe("Hello World Test", function() {

  describe("GET /", function() {

    it("returns status code 200", function() {

        request.get(base_url, function(error, response, body) {
            assert.equal(200, response.statusCode);
            helloWorld.closeServer();
            done();
        });


  });

});

});
