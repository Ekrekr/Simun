
const fs = require('fs')
const jwt = require('jsonwebtoken')

var privateKey = fs.readFileSync('./server/keys/private.key', 'utf8')
var publicKey = fs.readFileSync('./server/keys/public.key', 'utf8')

var tokenOptions = {
  issuer: 'Simun',
  subject: 'User',
  audience: 'http://localhost:7000',
  expiresIn: 600,
  algorithm: 'RS256'
}

module.exports = {
  sign: (payload) => {
    return jwt.sign(payload, privateKey, tokenOptions)
  },
  verify: (token) => {
    try {
      var verifyCheck = jwt.verify(token, publicKey, tokenOptions)
      return verifyCheck
    } catch (err) { 
      return false 
    }
  }
}
