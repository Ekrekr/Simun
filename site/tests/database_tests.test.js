/* eslint-env mocha */
// server_test.js
// Runs all server tests.
// Note:
// * All tests should follow the arrange, act then assert structure.
// * npm standard reports `describe` and `it` to not be defined so have warnings
//      disabled for those specific lines.
var expect = require('chai').expect
var database = require('../server/database.js')

function isEquivalent(a, b) {
  // If number of properties is different,
  // objects are not equivalent
  if (a[0].length != b[0].length) {
    return false;
  }

  const aValues = Object.values(a[0]);
  const bValues = Object.values(b[0]);

  for (var i = 0; i < aValues.length; i++) {
    // If values of same property are not equal,
    // objects are not equivalent
    if (aValues[i] !== bValues[i]) {
      return false;
    }
  }
  // If we made it this far, objects
  // are considered equivalent
  return true;
}

describe('database.getData()', async function () {
  it('should return the output described', async function () {
    var expectC = [{
      id: 1,
      forename: 'James',
      surname: 'Adams',
      username: 'Jadams',
      password: 'Maybe'
    }]
    let value = await database.getData('Login', 'Jadams').then(function (err, result) {
      // console.log(_.isEqual(expectC, err))
      if (isEquivalent(expectC, err)) {
        return true
      } else {
        return false
      }
    })
    expect(value).to.true
  })
})

describe('database.putData()', async function () {
  it('should return the output described', async function () {
    var expectD = `Rows inserted 1`
    let value = await database.putData('Login', 'Test1', 'Test2', 'Test3', 'Test4').then(function (err, result) {
      if (err == expectD) {
        return true
      } else {
        return false
      }
    })
    expect(value).to.true
  })
})

describe('database.updateData()', async function () {
  it('should return the output described', async function () {
    var expectE = `Row(s) updated: 1`
    let value = await database.updateData('Login', 'Test1', 'TestForename').then(function (err, result) {
      if (err == expectE) {
        return true
      } else {
        return false
      }
    })
    expect(value).to.true
  })
})

describe('database.deleteRow()', async function () {
  it('should return the output described', async function () {
    var expectF = `Row(s) deleted 1`
    let value = await database.deleteRow('Login', 'TestForename').then(function (err, result) {
      if (err == expectF) {
        return true
      } else {
        return false
      }
    })
    expect(value).to.true
  })
})