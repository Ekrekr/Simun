/* eslint-env mocha */
var expect = require('chai').expect
var server = require('../server/server.js')
var database = require('../server/database.js')
var Cookies = require('cookies')
var chai = require('chai')

var chaiHttp = require('chai-http')
chai.use(chaiHttp)
// server.connectToServer()

describe('Cookie Creation and Validation', async function () {
  it('Cookies are created and validated properly.', async function () {
    // The redirect needs to be created first as the login points to it.
    var redirectid = await database.createRedirect('TestAlias2', 1, true).then(result => {
      return result
    })
    // await server.generateJWT(res, req, redirectid, 'testUser', true)
    // console.log(res)
    chai.request('localhost:7000').post('/login').send({
      username: 'TestUsername',
      password: 'TestPassword'
    }).end(function (req, res) {
      console.log(res)
      // if (err) {
      //   throw err
      // }
      var token = new Cookies(req, res).get('currentUser')
      let decoded = jwt.verify(token, config.secret)
      expect(decoded.alias).to.equal('TestAlias2')
      done()
    })
    var redirectRemoved = await database.removeRedirect(redirectid, true).then(res => {
      return res
    })
    expect(redirectRemoved).to.not.equal(null)
  })
})
