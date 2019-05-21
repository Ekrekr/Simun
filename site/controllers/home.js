var express = require('express')
var router = require('express').Router()

router.get('/', async (req, res) => {
  if (!checkSessionCookie(req, res)) { return }
  res.redirect('home')
})

module.exports = router