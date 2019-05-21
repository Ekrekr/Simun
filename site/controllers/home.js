var express = require('express')
var router = require('express').Router()
var cookies = require('../models/cookies.js')

router.get('/', async (req, res) => {
  if (!cookies.verifySessionCookie(req, res)) { return }
  res.render('home')
})

module.exports = router