var cookies = require('../models/cookies.js')
var router = require('express').Router()

router.use('/account', require('./account'))
router.use('/home', require('./home'))
router.use('/inbox', require('./inbox'))
router.use('/outbox', require('./outbox'))
router.use('/global', require('./global'))
router.use('/snippet', require('./snippet'))

router.get('/', (req, res) => {
  res.redirect('/home')
})

module.exports = router