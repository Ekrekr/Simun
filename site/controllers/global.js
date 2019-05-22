var express = require('express')
var router = require('express').Router()
var database = require('../models/database.js')

router.get('/', async (req, res) => {
  var clientVariables = {}

  clientVariables.snippets = await database.getTopTenSnippets().then(res => { return res })

  var snippetContents = []
  await clientVariables.snippets.forEach(async (entry, index) => {
    console.log("ENTRYENTRYENTRY:", entry)
    var snippetContent = await database.getSnippetContent(entry.contentid).then(res => { return res[0] })
    // console.log('snippetContent', snippetContent)
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

  console.log()

  // res.render('global', {'topTenSnippets' : topTen})
  // res.render('global')
})

module.exports = router