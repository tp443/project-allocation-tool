const importExport = require('../static/importAndExport.js');


const assert = require('assert');

var person = {
  tmep: {
    firstName: "John",
    lastName: "Doe",
    age: 50,
    eyeColor: "blue"
  },
  ams2: {
    firstName: "Adam",
    lastName: "Appleby",
    age: 30,
    eyeColor: "green"
  }
};

describe("Client-Side", function() {
  it('correctly sorts object', () => {
    var tableData = [];
    Object.entries(person).forEach(
      ([key, value]) => tableData.push(value)
    );
    assert.equal(tableData.sort(importExport.sortProjectAllocation("firstName")), 4);
  });
});
