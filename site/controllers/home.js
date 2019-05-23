var router = require('express').Router()
var cookies = require('../models/cookies.js')

router.get('/', async (req, res) => {
  res.render('home')
})

module.exports = router