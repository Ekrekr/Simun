var cookies = require('../models/cookies.js')
var router = require('express').Router()

router.use('/account', require('./account'))
router.use('/home', require('./home'))
router.use('/inbox', require('./inbox'))
router.use('/outbox', require('./outbox'))
router.use('/global', require('./global'))
router.use('/snippet', require('./snippet'))

router.get('/', (req, res) => {
  var decodedCookie = cookies.verifySessionCookie(req, res)
  if (!decodedCookie) { res.redirect('/global'); return }

  res.redirect('/inbox')
})

module.exports = router