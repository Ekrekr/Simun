var express = require('express')
var router = require('express').Router()

router.get('/', async (req, res) => {
  if (!checkSessionCookie(req, res)) { return }
  console.log('Loading receive page.')

  var decodedCookie = checkSessionCookie(req, res)
  if (!decodedCookie) { return }

  var redirectID = decodedCookie.redirectid

  var clientVariables = {}
  clientVariables.snippets = []

  // Need to load snippet data from the database to display on the page.
  var redirect = await database.getRedirect(redirectID).then(res => { return res[0] })
  var snippets = JSON.parse(redirect.snippetids)

  // If no snippets found, then render an empty receive page.
  if (snippets.length === 0) {
    res.render('receive', clientVariables)
    return
  }

  // For each snippet, retrieve the snippet content ID.
  await snippets.forEach(async (entry, index) => {
    var snippet = await database.getSnippet(entry).then(res => { return res[0] })

    var snippetcontent = await database.getSnippetContent(snippet.contentid).then(res => { return res[0] })
    console.log("Entry:", entry, 'server: Rendering receive, snippetcontent.id: ', snippetcontent.id)

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
        res.render('receive', clientVariables)
      }, 100)
    }
  })
})

router.post('/comment', async (req, res) => {
  var decodedCookie = checkSessionCookie(req, res)
  if (!decodedCookie) { return }

  var valid = await database.addSnippetComment(req.body.snippetid, decodedCookie.alias, req.body.comment).then(res => { return res })
  console.log('response:', valid)

  res.send({success: true})
})

module.exports = router