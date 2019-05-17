/* eslint-env mocha */
var expect = require('chai').expect
var server = require('../server/server.js')
var database = require('../server/database.js')
var Cookies = require('cookies')
var chai = require('chai')
var jwt = require('jsonwebtoken')
var chaiHttp = require('chai-http')
var config = require('../server/config.js')
chai.use(chaiHttp)
// server.connectToServer()

describe('Cookie Validation', async function () {
  it('Cookies are validated properly.', async function (done) {

    var token = jwt.sign({
      data: 'TestAlias2'
    }, config.secret, {
      expiresIn: 30
    }, {
      algorithm: 'RS256'
    })
    let decoded = jwt.verify(token, config.secret)
    expect(decoded.data).to.equal('TestAlias2')
    done()
  })
})