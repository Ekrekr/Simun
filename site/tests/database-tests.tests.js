/* eslint-env mocha */
// server_test.js
// Runs all server tests.
// Note:
// * All tests should follow the arrange, act then assert structure.
// * npm standard reports `describe` and `it` to not be defined so have warnings
//      disabled for those specific lines.
var expect = require('chai').expect
var database = require('../server/database.js')

// Function to check if 2 objects are equivalent
function isEqualTo(a, b) {
  if (a[0].length !== b[0].length) {
    return false
  }
  const works = 1
  const aValues = Object.values(a[0])
  const bValues = Object.values(b[0])

  for (var i = 0; i < aValues.length; i++) {
    if (aValues[i] !== bValues[i]) {
      works = 2
    } else if (works == 2 && !database.compareHash(aValues[i], bValues[i])) {
      return false
    }
  }
  return true
}

// Get Data function test
describe('database.getData()', async function () {
  it('checks that login data can be retrieved from the database', async function () {
    var expectC = [{
      id: 1,
      forename: 'James',
      surname: 'Adams',
      username: 'Jadams',
      password: 'Maybe',
      salt: 'vj14m9qnktrhnc57'
    }]
    let value = await database.getData('Login', '1').then(function (result) {
      if (isEqualTo(expectC, result)) {
        return true
      } else {
        return false
      }
    })
    expect(value).to.equal(true)
  })
})

// Put Data function test
describe('database.putData()', async function () {
  it('checks that data can be written to the database login table', async function () {
    var expectD = `Rows inserted 1`
    let value = await database.putData('Login', 'Test1', 'Test2', 'Test3', database.hashingEntry('Test4' + 'E1F53135E559C253'), 'E1F53135E559C253').then(function (result) {
      if (result === expectD) {
        return true
      } else {
        return false
      }
    })
    expect(value).to.equal(true)
  })
})

// Update Data function test
describe('database.updateData()', async function () {
  it('checks that data can be updated in the database login table', async function () {
    var expectE = `Row(s) updated: 1`
    let value = await database.updateData('Login', 'Test1', 'TestForename').then(function (result) {
      if (result === expectE) {
        return true
      } else {
        return false
      }
    })
    expect(value).to.equal(true)
  })
})

// Delete Data function test
describe('database.deleteRow()', async function () {
  it('checks that data can be deleted from the database login table', async function () {
    var expectF = `Row(s) deleted 1`
    let value = await database.deleteRow('Login', 'TestForename').then(function (result) {
      if (result === expectF) {
        return true
      } else {
        return false
      }
    })
    expect(value).to.equal(true)
  })
})