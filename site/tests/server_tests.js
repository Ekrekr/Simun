// server_test.js
// Runs all server tests.
// Note: all tests should follow the arrange, act then assert structure.

var expect = require('chai').expect;
var server = require('../server/server');

describe('server.exampleFunc()', function () {
  it('should return the opposite belief of the input', function () {

    // 1. ARRANGE
    var expectA = false;
    var expectB = true;

    // 2. ACT
    var resultA = server.exampleFunc(false);
    var resultB = server.exampleFunc(true);

    // 3. ASSERT
    expect(resultA).to.be.equal(true);
    expect(resultB).to.be.equal(false);

  });
});
