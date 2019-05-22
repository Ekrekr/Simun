/* eslint-env mocha */
var expect = require('chai').expect
var database = require('../models/database.js')
var identifiers = require('../models/identifiers.js')

var redirect = null
var userID = null

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
  it('Accounts can\'t be created with idential usernames', async function () {
    var noUserID = await database.createUser('TestUsername', 'NewPassword', 0, true).then(res => { return res })
    expect(noUserID).to.equal(identifiers.duplicateID)
  })
})

describe('Account authentication and utility.', async function () {
  it('Generated password is valid for the user', async function () {
    var isValid = await database.authenticateUser('TestUsername', 'Password*1', true).then(res => { return res })
    expect(isValid).to.equal(true)

    isValid = await database.authenticateUser('TestUsername', 'pAsSwOrD*1', true).then(res => { return res })
    expect(isValid).to.equal(false)
  })
  it('Retrieve redirectID by using user\'s username', async function () {
    var redirectID = await database.getUserRedirectID('TestUsername', true).then(res => { return res })
    expect(redirect.id).to.equal(redirectID)
  })
})

describe('Snippet and Snippet Comment Creation, Retrieval, Forwarding and Deletion.', async function () {
  var snippetIDs = null
  var snippetID0 = null
  var snippetID1 = null
  it('Snippets can be created with content and forwarded.', async function () {
    // Create new snippet that forwards to two users.
    snippetIDs = await database.createSnippet('https://i.imgur.com/DccRRP7.jpg', 'Example Snippet', redirect.id, true).then(res => { return res })
    expect(snippetIDs).to.not.equal(null)
    snippetID0 = snippetIDs[0]
    snippetID1 = snippetIDs[1]
    expect(snippetID0).to.not.equal(snippetID1)
  })

  var snippetComment = 'This snippet really sucks'
  it('Snippets can have comments appended', async function () {
    var commentSnippetID = await database.addSnippetComment(snippetID0, redirect.alias, snippetComment, true).then(res => { return res })
    expect(commentSnippetID).to.not.equal(null)
  })

  it('Top ten snippets can be retrieved', async function () {
    var topTen = await database.getTopTenSnippetIDs(true).then(res => { return res })
    expect(topTen.length).to.equal(2)
  })

  var snippet0 = null
  var snippet1 = null
  it('Snippets can be retrieved.', async function () {
    // Retrieve the first snippet for checking the content
    snippet0 = await database.getSnippet(snippetID0, true).then(res => { return res[0] })
    snippet1 = await database.getSnippet(snippetID1, true).then(res => { return res[0] })
    expect(snippet0.contentid).to.equal(snippet1.contentid)
  })

  it('Snippets comments are stored correctly after having comment appended', async function () {
    var parsedComments = JSON.parse(snippet0.comments)
    expect(parsedComments[0].comment).to.equal(snippetComment)
  })

  it('Snippets and snippet content can be removed.', async function () {
    // Remove the snippet content first as snippets point to it.
    var contentID0 = await database.removeSnippetContent(snippet0.contentid, true).then(res => { return res })
    // TODO: try retrieving snippet and fail if successfully retrieves.
    expect(contentID0).to.not.equal(null)

    // Remove the two snippets.
    snippetID0 = await database.removeSnippet(snippetID0, true).then(res => { return res })
    snippetID1 = await database.removeSnippet(snippetID1, true).then(res => { return res })
    expect(snippetID0).to.not.equal(null)
    expect(snippetID1).to.not.equal(null)
  })
})

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
