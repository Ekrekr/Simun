/* eslint-env mocha */
// server_test.js
// Runs all server tests.
// Note:
// * All tests should follow the arrange, act then assert structure.
// * npm standard reports `describe` and `it` to not be defined so have warnings
//      disabled for those specific lines.
var expect = require('chai').expect
var server = require('../server/server.js')

describe('server.exampleFunc()', function () { // eslint-disable-line
  it('should return the opposite belief of the input', function () { // eslint-disable-line
    // 1. ARRANGE
    var resultA = server.exampleFunc(false)
    var resultB = server.exampleFunc(true)
    // 3. ASSERT
    expect(resultA).to.be.equal(true)
    expect(resultB).to.be.equal(false)
  })
})
describe('server.getData()', function () {
  it('should return the output described', function () {
    var expectC = `[{
      id: 1,
      forename: 'Jadams',
      surname: 'Adams',
      username: 'Jadams',
      password: 'Maybe'
    }]`
    server.getData('Login', '1').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectC)
      }
    })
  })
})
describe('server.putData()', function () {
  it('should return the output described', function () {
    var expectD = `Row(s) inserted: 1`
    server.putData('Login', 'Test1', 'Test2', 'Test3', 'Test4').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectD)
      }
    })
  })
})

describe('server.updateData()', function () {
  it('should return the output described', function () {
    var expectE = `Row(s) updated: 1`
    server.updateData('Login', 'Test1', 'TestForename').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectE)
      }
    })
  })
})
describe('server.deleteRow()', function () {
  it('should return the output described', function () {
    var expectF = `Row(s) deleted: 1`
    server.deleteRow('Login', 'TestForename').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectF)
      }
    }).catch((err) => {
      return err
    })
  })
})
