var express = require('express')
var router = require('express').Router()
var database = require('../models/database.js')
var cookies = require('../models/cookies.js')

router.get('/', async (req, res) => {
  var decodedCookie = cookies.verifySessionCookie(req, res)
  if (!decodedCookie) { return }

  var clientVariables = {alias : decodedCookie.alias}
  res.render('outbox', clientVariables)
})

// Imgur details:
// Client ID: 7abbdb4b52250c2
// Client secret: c3392f713529ca1a8ac91d90e7bedb728fd435b5

// Token details:
// Token Name:
// Token Name
// Access Token:
// 4d55cdbae23fded6a838d69e99912f19b01246df
// Token Type:
// bearer
// expires_in:
// 315360000
// scope:
// refresh_token:
// f0c1fa4e4aa76b693865710ed3391b961fdb6c72
// account_id:
// 108080435
// account_username:
// Ekrekr

router.post('/create-snippet', async (req, res) => {
  console.log('creating snippet')

  // Check cookie and retrieve redirect ID for attaching to the new snippets.
  var decodedCookie = cookies.verifySessionCookie(req, res)
  if (!decodedCookie) { return }
  var redirectID = decodedCookie.redirectid
  console.log('redirectid:', redirectid)

  // Upload the image to imgur, construct the url from the returned data.
  var imgurSuccess = await uploadToImgur(req.body.content).then(res => { return res })
  console.log('imgurSuccess:', imgurSuccess)
  if (!imgurSuccess) { return }
  var imgUrl = 'https://imgur.com/' + imgurSuccess.data.id
  console.log('imgUrl:', imgUrl)

  // Finally create the snippet according to the database's methodology.
  console.log('server: Creating snippet with imgUrl:', imgUrl, 'description:', req.body.title, 'redirectid:', redirectID)
  snippetIDs = await database.createSnippet(imgUrl, req.body.title, redirectID).then(res => { return res })
  console.log("snippetIDs:", snippetIDs)
  res.send({success: (snippetIDs === null ? false : true)})
})

module.exports = router