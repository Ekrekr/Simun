var express = require('express')
var router = express.Router()

router.use('/account', require('./account'))
router.use('/home', require('./home'))
router.use('/inbox', require('./inbox'))
router.use('/outbox', require('./outbox'))
router.use('/global', require('./global'))
router.use('/snippet', require('./snippet'))

router.get('/', (req, res) => {
  res.redirect('/account/login')
})

module.exports = router