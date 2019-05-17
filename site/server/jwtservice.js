
const fs = require('fs')
const jwt = require('jsonwebtoken')

var privateKey = fs.readFileSync('./server/keys/private.key', 'utf8')
var publicKey = fs.readFileSync('./server/keys/public.key', 'utf8')

var tokenOptions = {
  issuer: 'Simun',
  subject: 'User',
  audience: 'http://localhost:7000',
  expiresIn: 30,
  algorithm: 'RS256'
}

module.exports = {
  sign: (payload) => {
    return jwt.sign(payload, privateKey, tokenOptions)
  },
  verify: (token) => {
    try { return jwt.verify(token, publicKey, tokenOptions) } catch (err) { return false }
  }
  // ,
  // decode: (token) => {
  //   // Note: Only use this if the token has been verified as secure.
  //   return jwt.decode(token, { complete: true })
  // }
}
