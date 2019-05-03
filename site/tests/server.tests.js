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
var originalSnippet = null

describe('Account creation.', async function () {
  it('Login and redirect are created and retrieved correctly.', async function () {
    // The redirect needs to be created first as the login points to it.
    var redirectID = await database.createRedirect('TestAlias', 1, true).then(res => { return res })
    redirect = await database.getRedirect(redirectID, true).then(res => { return res[0] })
    expect(redirect.alias).to.equal('TestAlias')
    expect(redirect.roleid).to.equal(1)

    // Only the new login ID returned can be tested as the database is not allowed to return
    // user entry in order to not reveal the hashed and salted password.
    userID = await database.createUser('TestUsername', 'Password*1', redirectID, true).then(res => { return res })
    expect(userID).to.not.equal(null)
  })
})

describe('Snippet Creation and Retrieval.', async function () {
  it('Snippets can be created, retrieved, and are by default forwarded.', async function () {
    var snippetID = await database.createSnippet('https://i.imgur.com/DccRRP7.jpg', 'Example Snippet', redirect.id, true).then(res => { return res })
    originalSnippet = await database.getSnippet(snippetID, true).then(res => { return res[0] })
    expect(originalSnippet).to.not.equal(null)

    redirect = await database.getRedirect(redirect.id, true).then(res => { return res[0] })
  })
})

describe('Snippet Forwarding.', async function () {
  it('Snippets can be created, retrieved, and are by default forwarded.', async function () {
    
  })
})

describe('Snippet and Content Deletion.', async function () {
  it('Snippets and snippetcontents can be removed.', async function () {
    var contentID = await database.removeSnippetContent(originalSnippet.contentid, true).then(res => { return res })
    var snippetID = await database.removeSnippet(originalSnippet.id, true).then(res => { return res })
    // TODO: try retrieving snippet and fail if successfully retrieves.
    expect(contentID).to.not.equal(null)
    expect(snippetID).to.not.equal(null)
  })
})

// https://i.imgur.com/DccRRP7.jpg
// https://i.imgur.com/EwVxG0U.jpg

describe('Account Deletion.', async function () {
  it('Accounts and redirects can be removed.', async function () {
    // TODO: Try to retrieve user and redirect, test successful if it fails.
    // Clean up login and redirect.
    var userRemoved = await database.removeUser(userID, true).then(res => { return res })
    expect(userRemoved).to.not.equal(null)
    var redirectRemoved = await database.removeRedirect(redirect.id, true).then(res => { return res })
    expect(redirectRemoved).to.not.equal(null)
  })
})
