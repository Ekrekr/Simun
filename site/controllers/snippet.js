var express = require('express')
var router = require('express').Router()
var cookies = require('../models/cookies.js')
var database = require('../models/database.js')

router.get('/:id', (req, res) => {
  console.log('server: Retrieving snippet with id:', req.params.id)
  database.getSnippet(req.params.id).then(response => {
    res.send(JSON.stringify(response[0]))
  })
})

router.get('/content/:id', (req, res) => {
  console.log('server: Retrieving snippet content with id:', req.params.id)
  database.getSnippetContent(req.params.id).then(response => {
    res.send(JSON.stringify(response[0]))
  })
})

module.exports = router