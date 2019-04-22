/* eslint-env mocha */
var expect = require('chai').expect
var tools = require('../models/public/scripts/tools.js')
var server = require('../server/server.js')

describe('tools.retrieveData()', function () {
  it('checks the snippet content is available. Note: this will not work if server is not running', async function () {
    await server.connectToServer()
    var expected = 'https://i.imgur.com/DccRRP7.jpg'
    let value = await tools.retrieveData('snippetcontent', '0', (snippetcontent) => {
      if (snippetcontent.content === expected) {
        console.log('Gets Here')
        return true
      } else {
        console.log('Gets Here')
        return false
      }
    })
    expect(value).to.equal(true)
  })
})