// server_test.js
// Runs all server tests.
// Note:
// * All tests should follow the arrange, act then assert structure.
// * npm standard reports `describe` and `it` to not be defined so have warnings
//      disabled for those specific lines.
// import getData from '../server/server'
var expect = require('chai').expect
var path = require('path')
var assert = require('assert')
var server = require('../server/server.js')
// const sqlite3 = require('sqlite3').verbose()
// const dbPath = path.resolve(__dirname, '../database/database.db')
// let db = server.connectDatabase()
// server.getData('Login', '1').then(function (err, result) {
//   if (err) console.log(err)
//   else console.log(result)
// })
describe('server.exampleFunc()', function () { // eslint-disable-line
  it('should return the opposite belief of the input', function () { // eslint-disable-line
    // 1. ARRANGE
    var expectA = true
    var expectB = false

    var resultA = server.exampleFunc(false)
    var resultB = server.exampleFunc(true)
    // 3. ASSERT
    expect(resultA).to.be.true
    expect(resultB).to.be.false
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
    let resultC = server.getData('Login', '1')
    resultC.then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectC)
      }
    })
  })
})
describe('server.putData()', function () {
  it('should return the output described', function () {
    var expectD = `Row(s) inserted: 1`
    let resultD = server.putData('Login', 'Test1', 'Test2', 'Test3', 'Test4').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectD)
      }
    })
  })
})
describe('server.updateData()', function () {
  it('should return the output described', function () {
    var expectE = `Row(s) updated: 1`
    server.updateData('Login', 'Test1', 'Jadams').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectE)
      }
    })
  })
})
describe('server.deleteRow()', function () {
  it('should return the output described', function () {
    var expectF = `Row(s) deleted: 1`
    let resultF = server.deleteRow('Login', 'Test1').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectF)
      }
    }).catch((err) => {
      return err
    })
  })
})
