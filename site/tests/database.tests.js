/* eslint-env mocha */
var expect = require('chai').expect
var database = require('../server/database.js')

// Checks that two lists are equal and have equivalent items in respective locations.
function isEqual (a, b) {
  if (a[0].length !== b[0].length) {
    return false
  }

  const aValues = Object.values(a[0])
  const bValues = Object.values(b[0])

  for (var i = 0; i < aValues.length; i++) {
    if (aValues[i] !== bValues[i]) {
      return false
    }
  }
  return true
}

describe('Account creation; both Login and redirect insertion for user', async function () {
  it('Checks that login and redirect are created correctly', async function () {
    var expect = [{username: 'TestUsername', password: 'Password*1'}]
    let newUserID = await database.createUser('TestUsername', 'Password*1', true).then(res => {
      return isEqual(expect, res)
    })
    let value = await database.createUser('TestUsername', 'Password*1', true).then(res => {
      return isEqual(expect, res)
    })


    expect(value).to.equal(true)

    var expect = [{username: 'TestUsername', password: 'Password*1'}]
    let value = await database.createUser('TestUsername', 'Password*1', true).then(result => {
      return isEqual(expect, result)
  })
})

describe('database.putUserData()', async function () {
  it('checks that data can be written to the database login table', async function () {
    var expectD = `Rows inserted 1`
    let value = await database.putUserData('Login', 'Test1', 'Test2', 'Test3', 'Test4').then(function (result) {
      if (result === expectD) {
        return true
      } else {
        return false
      }
    })
    expect(value).to.equal(true)
  })
})

describe('database.updateUserData()', async function () {
  it('checks that data can be updated in the database login table', async function () {
    var expectE = `Row(s) updated: 1`
    let value = await database.updateUserData('Login', 'Test1', 'TestForename').then(function (result) {
      if (result === expectE) {
        return true
      } else {
        return false
      }
    })
    expect(value).to.equal(true)
  })
})

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
