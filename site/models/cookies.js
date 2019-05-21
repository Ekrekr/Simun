
const fs = require('fs')
const jwt = require('jsonwebtoken')
const path = require('path')

var privateKey = fs.readFileSync(path.join(__dirname, '/keys/private.key'), 'utf8')
var publicKey = fs.readFileSync(path.join(__dirname, '/keys/public.key'), 'utf8')

var tokenOptions = {
  issuer: 'Simun',
  subject: 'User',
  audience: 'http://localhost:7000',
  expiresIn: 600,
  algorithm: 'RS256'
}

function sign (payload) {
  return jwt.sign(payload, privateKey, tokenOptions)
}

function verify (token) {
  try {
    var verifyCheck = jwt.verify(token, publicKey, tokenOptions)
    return verifyCheck
  } catch (err) {
    return false
  }
}

function verifySessionCookie (req, res) {
  // If there is no cookie, then send to login page.
  if (req.cookies === undefined) {
    res.redirect('/')
    return false
  }

  if (req.cookies['session'] === undefined) {
    res.redirect('/')
    return false
  }

  // Verify the cookie, if it is not valid then delete the cookie and return to the login page.
  var decodedCookie = verify(req.cookies['session'])
  if (decodedCookie === false) {
    res.clearCookie('session')
    res.redirect('/')
    return false
  }
  return decodedCookie
}

async function sendSessionCookie (req, res, alias, redirectID) {
  // Create a token so that the user doesn't have to log in again for a while,
  // return the token in a delicious cookie.
  var token = await sign({ alias: alias, redirectid: redirectID })
  res.cookie('session', token)
}

module.exports = {
  verifySessionCookie: verifySessionCookie,
  sendSessionCookie: sendSessionCookie
}