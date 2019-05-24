var express = require('express')
var router = require('express').Router()
var database = require('../models/database.js')
var cookies = require('../models/cookies.js')

router.get('/', async (req, res) => {
  var decodedCookie = cookies.verifySessionCookie(req, res)
  if (!decodedCookie) { res.redirect('/account/login'); return }

  var clientVariables = {alias : decodedCookie.alias}
  res.render('outbox', clientVariables)
})

router.post('/create-snippet', async (req, res) => {
  var decodedCookie = cookies.verifySessionCookie(req, res)
  if (!decodedCookie) { res.redirect('/account/login'); return }
  console.log('creating snippet')

  var redirectID = decodedCookie.redirectid

  // Finally create the snippet according to the database's methodology.
  console.log('server: Creating snippet with imgUrl:', req.body.imgurl, 'description:', req.body.title, 'redirectid:', redirectID)
  snippetIDs = await database.createSnippet(req.body.imgurl, req.body.title, redirectID).then(res => { return res })
  console.log("snippetIDs:", snippetIDs)
  res.send({success: (snippetIDs === null ? false : true)})
})

module.exports = router