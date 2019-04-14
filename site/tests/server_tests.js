// server_test.js
// Runs all server tests.
// Note:
// * All tests should follow the arrange, act then assert structure.
// * npm standard reports `describe` and `it` to not be defined so have warnings
//      disabled for those specific lines.

var expect = require('chai').expect
var server = require('../server/server')

describe('server.exampleFunc()', function () { // eslint-disable-line
  it('should return the opposite belief of the input', function () { // eslint-disable-line
    // 1. ARRANGE
    var expectA = true
    var expectB = false


    // 3. ASSERT
    expect(resultA).to.be.equal(expectA)
    expect(resultB).to.be.equal(expectB)
  })
})

describe('server.DatabaseFunctions()', function () {
  it('should return the output described', function () {
    var expectC = `James, Adams, Jadams, Maybe`
    var expectD = `Row(s) inserted: 1`
    var expectE = `Row(s) updated: 1`
    var expectF = `Row(s) deleted: 1`
    // 2. ACT
    var resultA = server.exampleFunc(false)
    var resultB = server.exampleFunc(true)
    var resultC = server.getData('Login', 1)
    var resultD = server.putData('Login', 'Test1', 'Test2', 'Test3', 'Test4')
    var resultE = server.updateData('Login', 'James', '1')
    var resultF = server.deleteData('Login', '2')

    expect(resultC).to.be.equal(expectC)
    expect(resultD).to.be.equal(expectD)
    expect(resultE).to.be.equal(expectE)
    expect(resultF).to.be.equal(expectF)
  })
})