var express = require('express')
var router = require('express').Router()
var database = require('../models/database.js')
var cookies = require('../models/cookies.js')

router.get('/', async (req, res) => {
  if (!cookies.verifySessionCookie(req, res)) { return }
  res.render('send')
})

router.post('/create-snippet/', (req, res) => {
  console.log('server: Creating snippet with content:', req.body.content, 'description:', req.body.description, 'redirectid:', req.body.redirectid)
  database.createSnippet(req.body.content, req.body.description, req.body.redirectid).then(res => {
    return res
  })
})

module.exports = router