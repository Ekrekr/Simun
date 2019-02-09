// server_test.js
// Runs all server tests.
// Note:
// * All tests should follow the arrange, act then assert structure.
// * npm standard reports `describe` and `it` to not be defined so have warnings
//      disabled for those specific lines.

var expect = require('chai').expect
var server = require('../server/server')

describe('server.exampleFunc()', function () {                       // eslint-disable-line
  it('should return the opposite belief of the input', function () { // eslint-disable-line
    // 1. ARRANGE
    var expectA = true
    var expectB = false

    // 2. ACT
    var resultA = server.exampleFunc(false)
    var resultB = server.exampleFunc(true)

    // 3. ASSERT
    expect(resultA).to.be.equal(expectA)
    expect(resultB).to.be.equal(expectB)
  })
})
