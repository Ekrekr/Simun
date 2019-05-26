var router = require('express').Router()
var database = require('../models/database.js')
var cookies = require('../models/cookies.js')

router.get('/', async (req, res) => {
  var decodedCookie = cookies.verifySessionCookie(req, res)

  // Need logged in status in order to change sections shown in header.
  var clientVariables = {}
  clientVariables.loggedIn = (decodedCookie !== false)
  clientVariables.noSnippets = false

  clientVariables.snippets = await database.getTopTenSnippets().then(res => { return res })

  if (clientVariables.snippets.length === 0) {
    clientVariables.noSnippets = true
    clientVariables.snippetContents = {}
    clientVariables.snippets = [{id: 0, forwardCount: 0}]
    clientVariables.snippetContents = [{description: 'There\'s nothing here today.', content: '/assets/images/loading.gif'}]
    res.render('global', clientVariables)
    return
  }

  var snippetContents = []
  await clientVariables.snippets.forEach(async (entry, index) => {
    var snippetContent = await database.getSnippetContent(entry.contentid).then(res => { return res[0] })
    snippetContents.push(snippetContent)

    // Only return final source if it's final iteration to prevent loss.
    if (index === clientVariables.snippets.length - 1) {
      clientVariables.snippetContents = snippetContents
      console.log('clientVariables:', clientVariables)
      // Send the created page back to user after loading all the variables,
      // with a slight delay to prevent further problems.
      setTimeout(function () {
        res.render('global', clientVariables)
      }, 100)
    }
  })
})

module.exports = router