/* eslint-env mocha */
var expect = require('chai').expect
var database = require('../server/snippet-logic.js')

describe('snippet creation, forwarding and deletion', async function () {
  it('checks the snippet content is available. Note: this will not work if server is not running', async function () {
    // 1. Create a new account.
    // 2. Create and send a new snippet; original snippet should dissappear but should be replaced by two new similar ones.
    // 3. Forward one of these snippets on. Same should happen again.
    // 4. Delete all three snippets, should have none attached.
    // 5. Delete the account.

    await server.connectToServer()
    var expected = 'https://i.imgur.com/DccRRP7.jpg'
    tools.retrieveData('snippetcontent', '0', (err, snippetcontent) => {
      console.log('Snippet content:', snippetcontent.content)
      if (err) {
        console.log('Error retrieving snippetcontent from server:', err)
      }
      expect(snippetcontent.content == expected).to.equal(true)
    })
  })
})

// https://i.imgur.com/DccRRP7.jpg
// https://i.imgur.com/EwVxG0U.jpg