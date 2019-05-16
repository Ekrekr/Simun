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
  it('Cookies are created and validated properly.', async function (done) {
    chai.request('localhost:7000')
      .post('/')
      .send({
        username: 'TestUsername2',
        password: 'TestPassword2'
      })
      .end(async function (req, res) {
        await server.generateJWT(res, req, 1, 'testUser', true)

        var token = new Cookies(req, res).get('testUser')
        console.log(token)
        let decoded = jwt.verify(token, config.secret)
        console.log(decoded)
        expect(decoded.alias).to.equal('TestAlias2')
      })
    done()
  })
})