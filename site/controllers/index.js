var express = require('express')
var router = express.Router()

function checkSessionCookie (req, res) {
  // If there is no cookie, then send to login page.
  if (req.cookies['session'] === undefined) {
    res.redirect('login')
    return false
  }

  // Verify the cookie, if it is not valid then delete the cookie and return to the login page.
  var decodedCookie = jwtservice.verify(req.cookies['session'])
  if (decodedCookie === false) {
    res.clearCookie('session')
    res.redirect('login')
    return false
  }
  return decodedCookie
}

async function sendSessionCookie (req, res, alias, redirectID) {
  // Create a token so that the user doesn't have to log in again for a while,
  // return the token in a delicious cookie.
  var token = await jwtservice.sign({ alias: alias, redirectid: redirectID })
  res.cookie('session', token)
}

router.use('/account', require('./account'))
router.use('/home', require('./home'))
router.use('/inbox', require('./inbox'))
router.use('/outbox', require('./outbox'))
router.use('/global', require('./global'))

router.get('/', (req, res) => {
  res.redirect('account/login')
})

module.exports = router