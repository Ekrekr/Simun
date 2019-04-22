/* eslint-env mocha */

var expect = require('chai').expect
var tools = require('../models/public/scripts/tools.js')
var assert = require('assert')

describe('tools.retrieveData()', function () {
  it('checks the snippet content is available. Note: this will not work if server is not running', function () {
    var expect = 'https://i.imgur.com/DccRRP7.jpg'
    tools.retrieveData('snippetcontent', '0', (err, snippetcontent) => {
      assert.equal(snippetcontent.content, expect)
    })
  })
})
