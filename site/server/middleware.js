// This is for cookies to check to see if the token is valid or not
// This is through the config secret and whether or not the token has expired
let jwt = require('jsonwebtoken')
const config = require('./config.js')
module.exports = {
  checkToken: checkToken
}

function checkToken(req, res) {
  let token = req.headers['x-access-token'] || req.headers['authorization'] // Express headers are auto converted to lowercase
  console.log(token)
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length)
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        })
      } else {
        req.decoded = decoded
        // next()
      }
    })
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    })
  }
}