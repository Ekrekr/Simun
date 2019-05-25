var express = require('express')
var router = require('express').Router()
var cookies = require('../models/cookies.js')
var database = require('../models/database.js')

router.get('/', async (req, res) => {
  var decodedCookie = cookies.verifySessionCookie(req, res)
  if (!decodedCookie) { res.redirect('/account/login'); return }

  var redirectID = decodedCookie.redirectid

  var clientVariables = {}
  clientVariables.snippets = []
  clientVariables.placeholderImage = '/assets/images/loading.gif'

  // Need to load snippet data from the database to display on the page.
  var redirect = await database.getRedirect(redirectID).then(res => { return res[0] })
  if (typeof redirect === "undefined") {
    console.log('No redirect found for ID:', redirectID)
    res.redirect('/account/logout')
  }
  var snippets = JSON.parse(redirect.snippetids)

  // If no snippets found, then render an empty inbox page.
  if (snippets.length === 0) {
    console.log('Rendering 0')
    clientVariables.placeholderImage = '/assets/images/placeholder.png'
    res.render('inbox', clientVariables)
    return
  }

  // For each snippet, retrieve the snippet content ID.
  await snippets.forEach(async (entry, index) => {
    var snippet = await database.getSnippet(entry).then(res => { return res[0] })

    var snippetcontent = await database.getSnippetContent(snippet.contentid).then(res => { return res[0] })

    clientVariables.snippets.push({
      'description': snippetcontent.description,
      'content': snippetcontent.content,
      'snippetid': snippet.id,
      'comments': snippet.comments
    })

    // Only return final source if it's final iteration to prevent loss.
    if (index === snippets.length - 1) {
      // Send the created page back to user after loading all the variables,
      // with a slight delay to prevent further problems.
      setTimeout(function () {
        res.render('inbox', clientVariables)
      }, 100)
    }
  })
})

router.post('/comment', async (req, res) => {
  var decodedCookie = cookies.verifySessionCookie(req, res)
  if (!decodedCookie) { res.redirect('/account/login'); return }

  var valid = await database.addSnippetComment(req.body.snippetid, decodedCookie.alias, req.body.comment).then(res => { return res })

  // Forward the snippet.
  await database.forwardSnippet(req.body.snippetid)
  await database.removeFromRedirectSnippetList(decodedCookie.redirectid, req.body.snippetid)

  res.send({success: true})
})

router.post('/forward-snippet', async (req, res) => {
  var decodedCookie = cookies.verifySessionCookie(req, res)
  if (!decodedCookie) { res.redirect('/account/login'); return }
  
  console.log('server: Forwarding snippet id:', req.body.snippetid)
  await database.forwardSnippet(req.body.snippetid)

  res.send({success: true})
})

router.post('/trash-snippet', async (req, res) => {
  var decodedCookie = cookies.verifySessionCookie(req, res)
  if (!decodedCookie) { res.redirect('/account/login'); return }

  await database.removeSnippet(req.body.snippetid)
  await database.removeFromRedirectSnippetList(decodedCookie.redirectid, req.body.snippetid)

  res.send({success: true})
})

module.exports = router