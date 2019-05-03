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

var redirect = null
var userID = null

describe('Account creation.', async function () {
  it('Checks that login and redirect are created and retrieved correctly.', async function () {
    // The redirect needs to be created first as the login points to it.
    var redirectID = await database.createRedirect('TestAlias', 1, true).then(res => { return res })
    redirect = await database.getRedirect(redirectID, true).then(res => { return res[0] })
    expect(redirect.alias).to.equal('TestAlias')
    expect(redirect.roleid).to.equal(1)

    // Only the new login ID returned can be tested as the database is not allowed to return user entry.
    // The new user ID should be 0 as it's the first user in the tests database.
    userID = await database.createUser('TestUsername', 'Password*1', redirectID, true).then(res => { return res })
    expect(userID).to.not.equal(null)
  })
})

describe('Snippet Creation.', async function () {
  it('Checks that snippets can be created and are by default forwarded.', async function () {
    var snippetID = await database.createSnippet('https://i.imgur.com/DccRRP7.jpg', 'Example Snippet', redirect.id, true).then(res => { return res })
    expect(snippetID).to.not.equal(null)
    console.log('SnippetID found:', snippetID)
  })
})

// https://i.imgur.com/DccRRP7.jpg
// https://i.imgur.com/EwVxG0U.jpg

describe('Account Deletion.', async function () {
  it('Checks accounts and redirects can be removed from the system.', async function () {
    // TODO: Try to retrieve user and redirect, test successful if it fails.
    // Clean up login and redirect.
    var userRemoved = await database.removeUser(userID, true).then(res => { return res })
    expect(userRemoved).to.not.equal(null)
    var redirectRemoved = await database.removeRedirect(redirect.id, true).then(res => { return res })
    expect(redirectRemoved).to.not.equal(null)
  })
})

// describe('database.putUserData()', async function () {
//   it('checks that data can be written to the database login table', async function () {
//     var expectD = `Rows inserted 1`
//     let value = await database.putUserData('Login', 'Test1', 'Test2', 'Test3', 'Test4').then(function (result) {
//       if (result === expectD) {
//         return true
//       } else {
//         return false
//       }
//     })
//     expect(value).to.equal(true)
//   })
// })

// describe('database.updateUserData()', async function () {
//   it('checks that data can be updated in the database login table', async function () {
//     var expectE = `Row(s) updated: 1`
//     let value = await database.updateUserData('Login', 'Test1', 'TestForename').then(function (result) {
//       if (result === expectE) {
//         return true
//       } else {
//         return false
//       }
//     })
//     expect(value).to.equal(true)
//   })
// })

// describe('database.deleteRow()', async function () {
//   it('checks that data can be deleted from the database login table', async function () {
//     var expectF = `Row(s) deleted 1`
//     let value = await database.deleteRow('Login', 'TestForename').then(function (result) {
//       if (result === expectF) {
//         return true
//       } else {
//         return false
//       }
//     })
//     expect(value).to.equal(true)
//   })
// })
