var express = require('express')
var router = require('express').Router()

router.get('/login', async (req, res) => {
  // if (req.cookies['session'] !== undefined) {
  //   res.redirect('index')
  // }
  res.render('login')
})

router.post('/login', async (req, res) => {
  console.log('Attempting to log in with username', req.body.username, 'and password', req.body.password)

  var isValid = await database.authenticateUser(req.body.username, req.body.password).then(res => { return res })
  if (isValid) {
    // Create a token so that the user doesn't have to log in again for a while,
    // return the token in a delicios cookie.
    var redirectID = await database.getUserRedirectID(req.body.username).then(res => { return res })
    console.log('login redirectID:', redirectID)
    var redirect = await database.getRedirect(redirectID).then(res => { return res[0] })
    console.log('login redirect:', redirect)
    await sendSessionCookie(req, res, redirect.alias, redirectID)
    res.redirect('index')
  } else {
    // TODO: Update this with notification of incorrect credentials.
    console.log('Incorrect password. TODO: Add graphic response here to say already taken.')
    res.render('login')
  }
})

router.post('/register', async (req, res) => {
  console.log('Attempting to register account with username', req.body.username + ', password', req.body.password, 'and alias', req.body.alias)

  // Create a redirect to attach to the user details.
  var redirectID = await database.createRedirect(req.body.alias, 1).then(res => { return res })

  // Create an account pointing to the redirect
  var userID = await database.createUser(req.body.username, req.body.password, redirectID).then(res => { return res })
  if (userID === identifiers.duplicateID) {
    console.log('duplicate ID found. TODO: Add graphic response here to say already taken.')
    res.render('register')
    return
  }

  await sendSessionCookie(req, res, req.body.username, redirectID)

  res.redirect('index')
})

router.get('/logout', (req, res) => {
  res.clearCookie('session')
  res.redirect('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

module.exports = router