var express = require('express')
var router = require('express').Router()
var cookies = require('../models/cookies.js')
var database = require('../models/database.js')
var identifiers = require('../models/identifiers.js')
var passwordValidator = require('password-validator');

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
    res.render('login', {errorMessage: 'Username or password is invalid.'})
  }
})

router.post('/register', async (req, res) => {
  removeCookieIfPresent(req, res)

  // Check password follows rules.
  var passwordSchema = new passwordValidator();
  passwordSchema.is().min(8).is().max(32).has().uppercase().has().lowercase();
  if(!passwordSchema.validate(req.body.password)) {
    res.render('register', {errorMessage: 'Password must be 8 - 32 characters and have upper and lower case letters.'})
    return
  }

  // Check username and alias follow rules.
  var nameSchema = new passwordValidator();
  nameSchema.is().min(3).is().max(16);
  if(!nameSchema.validate(req.body.username)) {
    res.render('register', {errorMessage: 'Username must be 3 - 15 characters.'})
    return
  }
  if(!nameSchema.validate(req.body.alias)) {
    res.render('register', {errorMessage: 'Alias must be 3 - 15 characters.'})
    return
  }

  // Create a redirect to attach to the user details.
  var redirectID = await database.createRedirect(req.body.alias, 1).then(res => { return res })

  // Create an account pointing to the redirect
  var userID = await database.createUser(req.body.username, req.body.password, redirectID).then(res => { return res })
  if (userID === identifiers.duplicateID) {
    await database.removeRedirect(redirectID).then(res => { return res })
    res.render('register', {errorMessage: 'Username already taken.'})
    return
  }

  await cookies.sendSessionCookie(req, res, req.body.username, redirectID)

  res.redirect('/')
})

router.get('/logout', (req, res) => {
  res.clearCookie('session')
  res.redirect('/account/login')
})

router.get('/account', (req, res) => {
  res.clearCookie('session')
  res.redirect('/account/login')
})

router.get('/register', (req, res) => {
  removeCookieIfPresent(req, res)
  
  res.render('register')
})

module.exports = router