var router = require('express').Router()
var cookies = require('../models/cookies.js')

router.get('/', async (req, res) => {
  // Need logged in status in order to change sections shown in header.
  var decodedCookie = cookies.verifySessionCookie(req, res)
  res.render('home', {loggedIn : (decodedCookie !== false)})
})

module.exports = router