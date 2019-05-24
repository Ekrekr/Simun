var express = require('express')
var router = require('express').Router()
var cookies = require('../models/cookies.js')
var database = require('../models/database.js')
var identifiers = require('../models/identifiers.js')

function removeCookieIfPresent(req, res) {
  var decodedCookie = cookies.verifySessionCookie(req, res)
  if (decodedCookie !== false) { res.clearCookie('session') }
}

router.get('/login', async (req, res) => {
  removeCookieIfPresent(req, res)
  res.render('login')
})

router.post('/login', async (req, res) => {
  removeCookieIfPresent(req, res)

  var isValid = await database.authenticateUser(req.body.username, req.body.password).then(res => { return res })
  if (isValid) {
    // Create a token so that the user doesn't have to log in again for a while,
    // return the token in a delicios cookie.
    var redirectID = await database.getUserRedirectID(req.body.username).then(res => { return res })
    var redirect = await database.getRedirect(redirectID).then(res => { return res[0] })
    await cookies.sendSessionCookie(req, res, redirect.alias, redirectID)
    res.redirect('/home')
  } else {
    // TODO: Update this with notification of incorrect credentials.
    console.log('Incorrect password. TODO: Add graphic response here to say already taken.')
    res.render('login')
  }
})

router.post('/register', async (req, res) => {
  removeCookieIfPresent(req, res)

  // Create a redirect to attach to the user details.
  var redirectID = await database.createRedirect(req.body.alias, 1).then(res => { return res })

  // Create an account pointing to the redirect
  var userID = await database.createUser(req.body.username, req.body.password, redirectID).then(res => { return res })
  if (userID === identifiers.duplicateID) {
    console.log('duplicate ID found. TODO: Add graphic response here to say already taken.')
    await database.removeRedirect(redirectID).then(res => { return res })
    res.render('register')
    return
  }

  await cookies.sendSessionCookie(req, res, req.body.username, redirectID)

  res.redirect('/')
})

router.get('/logout', (req, res) => {
  res.clearCookie('session')
  res.redirect('/account/login')
})

router.get('/register', (req, res) => {
  removeCookieIfPresent(req, res)
  
  res.render('register')
})

module.exports = router