/* eslint-env mocha */
// server_test.js
// Runs all server tests.
// Note:
// * All tests should follow the arrange, act then assert structure.
// * npm standard reports `describe` and `it` to not be defined so have warnings
//      disabled for those specific lines.
var expect = require('chai').expect
var database = require('../server/database.js')

describe('database.getData()', async function () {
  it('should return the output described', function () {
    var expectC = `[{
      id: 1,
      forename: 'Jadams',
      surname: 'Adams',
      username: 'Jadams',
      password: 'Maybe'
    }]`
    database.getData('Login', 'Jadams').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectC)
      }
    })
  })
})

describe('database.putData()', async function () {
  it('should return the output described', function () {
    var expectD = `Row(s) inserted: 1`
    database.putData('Login', 'Test1', 'Test2', 'Test3', 'Test4').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectD)
      }
    })
  })
})

describe('database.updateData()', async function () {
  it('should return the output described', function () {
    var expectE = `Row(s) updated: 1`
    database.updateData('Login', 'Test1', 'TestForename').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectE)
      }
    })
  })
})

describe('database.deleteRow()', async function () {
  it('should return the output described', function () {
    var expectF = `Row(s) deleted: 1`
    database.deleteRow('Login', 'TestForename').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectF)
      }
    })
  })
})