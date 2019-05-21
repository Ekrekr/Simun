var express = require('express')
var router = require('express').Router()

router.get('/', async (req, res) => {
  // if (!checkSessionCookie(req, res)) { return }
  res.render('send')
})

router.post('/create-snippet/', (req, res) => {
  console.log('server: Creating snippet with content:', req.body.content, 'description:', req.body.description, 'redirectid:', req.body.redirectid)
  database.createSnippet(req.body.content, req.body.description, req.body.redirectid).then(res => {
    return res
  })
})

module.exports = router