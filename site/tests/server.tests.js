/* eslint-env mocha */
var expect = require('chai').expect
var cookies = require('../models/cookies.js')
const jwt = require('jsonwebtoken')

var legitToken = null
var fakeToken = null

describe('Token logic', () => {
  it('Token can be created', (done) => {
    var payload = { username: 'test user 1' }

    // Create a real token that should be viable to decode.
    legitToken = cookies.sign(payload)
    expect(legitToken).to.not.equal(null)

    // Create a fake token with the same paylode that should not be accepted as legitimate.
    fakeToken = jwt.sign(payload, '-----BEGIN PUBLIC KEY-----asdasdasdasdasd-----END PUBLIC KEY-----', {})
    expect(fakeToken).to.not.equal(null)
    done()
  })
  it('Token can be verified', (done) => {
    // Test both the tokens, the legit being correctly decodeable and the fake being detectable as fake.
    var legitVerifiedToken = cookies.verify(legitToken)
    expect(legitVerifiedToken.username).to.equal('test user 1')
    var fakeVerifiedToken = cookies.verify(fakeToken)
    expect(fakeVerifiedToken.username).to.not.equal('test user 1')
    done()
  })
})
