/**
 * This code is for testing the API
 *
 * @author tmep
 * @date August 8th 2018
 * @module tests/testapi.js
 */

var mocha = require("mocha");
var chai = require("chai");
var chaiHttp = require("chai-http");
var should = chai.should();
chai.use(chaiHttp);

//var api = require("../js/api");
var server = require("../main");

describe("API", function() {
  it('should be able to GET saved file from "last-saved-file"', function() {
    chai.request(server)
      .get('/getJSONFile')
      .end(function(err, res) {
        res.should.have.status(201);
        let obj = JSON.parse(res.text);
        obj.tableData.should.be.an('array');
      });
  });
});
