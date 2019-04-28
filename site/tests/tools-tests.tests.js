/* eslint-env mocha */
var expect = require('chai').expect
var tools = require('../models/public/scripts/tools.js')
var server = require('../server/server.js')

// describe('tools.retrieveData()', function () {
//   it('checks the snippet content is available. Note: this will not work if server is not running', async function () {
//     await server.connectToServer()
//     var expected = 'https://i.imgur.com/DccRRP7.jpg'
//     let value = await tools.retrieveData('snippetcontent', '0').then(function (result) {
//       if (result.content === expected) {
//         return true
//       } else {
//         return false
//       }
//     })
//     expect(value).to.equal(true)
//   })
// })
