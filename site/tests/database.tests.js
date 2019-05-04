/* eslint-env mocha */
var expect = require('chai').expect
var database = require('../server/database.js')

var redirect = null
var userID = null

describe('Account creation.', async function () {
  it('Login and redirect are created and retrieved correctly.', async function () {
    // The redirect needs to be created first as the login points to it.
    var redirectID = await database.createRedirect('TestAlias', 1, true).then(res => {
      return res
    })
    redirect = await database.getRedirect(redirectID, true).then(res => {
      return res[0]
    })
    expect(redirect.alias).to.equal('TestAlias')
    expect(redirect.roleid).to.equal(1)

    // Only the new login ID returned can be tested as the database is not allowed to return
    // user entry in order to not reveal the hashed and salted password.
    userID = await database.createUser('TestUsername', 'passwords', redirectID, true).then(res => {
      return res
    })
    expect(userID).to.not.equal(null)
  })
})

describe('Snippet Creation, Retrieval, Forwarding and Deletion.', async function () {
  it('Snippets can be created, retrieved, and forwarded (Forwarding done by default in creation).', async function () {
    // Create new snippet that forwards to two users.
    var snippetIDs = await database.createSnippet('https://i.imgur.com/DccRRP7.jpg', 'Example Snippet', redirect.id, true).then(res => {
      return res
    })
    expect(snippetIDs).to.not.equal(null)
    var snippetID0 = snippetIDs[0]
    var snippetID1 = snippetIDs[1]
    expect(snippetID0).to.not.equal(snippetID1)

    // Retrieve the first snippet for checking the content
    var snippet0 = await database.getSnippet(snippetID0, true).then(res => {
      return res[0]
    })
    var snippet1 = await database.getSnippet(snippetID1, true).then(res => {
      return res[0]
    })
    expect(snippet0.contentid).to.equal(snippet1.contentid)

    // Remove the snippet content first as snippets point to it.
    var contentID0 = await database.removeSnippetContent(snippet0.contentid, true).then(res => {
      return res
    })
    // TODO: try retrieving snippet and fail if successfully retrieves.
    expect(contentID0).to.not.equal(null)

    // Remove the two snippets.
    snippetID0 = await database.removeSnippet(snippetID0, true).then(res => {
      return res
    })
    snippetID1 = await database.removeSnippet(snippetID1, true).then(res => {
      return res
    })
    expect(snippetID0).to.not.equal(null)
    expect(snippetID1).to.not.equal(null)
  })
})

describe('Account Deletion.', async function () {
  it('Accounts and redirects can be removed.', async function () {
    // TODO: Try to retrieve user and redirect, test successful if it fails.
    // Clean up login and redirect.
    var userRemoved = await database.removeUser(userID, true).then(res => {
      return res
    })
    expect(userRemoved).to.not.equal(null)
    var redirectRemoved = await database.removeRedirect(redirect.id, true).then(res => {
      return res
    })
    expect(redirectRemoved).to.not.equal(null)
  })
})
