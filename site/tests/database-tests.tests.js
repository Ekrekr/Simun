/* eslint-env mocha */

var expect = require('chai').expect
var database = require('../server/database.js')

describe('database.getData()', function () {
  it('checks that login data can be retrieved from the database', function () {
    var expectC = `[{
      id: 1,
      forename: 'Jadams',
      surname: 'Adams',
      username: 'Jadams',
      password: 'Maybe'
    }]`
    let resultC = database.getData('login', '1')
    resultC.then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectC)
      }
    })
  })
})

describe('database.putData()', function () {
  it('checks that data can be written to the database login table', function () {
    var expectD = `Row(s) inserted: 1`
    database.putData('login', 'Test1', 'Test2', 'Test3', 'Test4').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectD)
      }
    })
  })
})

describe('database.updateData()', function () {
  it('checks that data can be updated in the database login table', function () {
    var expectE = `Row(s) updated: 1`
    database.updateData('login', 'Test1', 'TestForename').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectE)
      }
    })
  })
})

describe('database.deleteRow()', function () {
  it('checks that rows can be deleted from login table of the database', function () {
    var expectF = `Row(s) deleted: 1`
    database.deleteRow('login', 'TestForename').then(function (err, result) {
      if (err) {} else {
        expect(result).to.equal(expectF)
      }
    }).catch((err) => {
      return err
    })
  })
})
