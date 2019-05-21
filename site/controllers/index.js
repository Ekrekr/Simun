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

router.use('/receive', require('./receive'))
router.use('/send', require('./send'))

router.get('/', (req, res) => {
  res.render('login')
})

module.exports = router