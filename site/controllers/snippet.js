var express = require('express')
var router = require('express').Router()
var cookies = require('../models/cookies.js')
var database = require('../models/database.js')

router.get('/:id', (req, res) => {
  database.getSnippet(req.params.id).then(response => {
    res.send(JSON.stringify(response[0]))
  })
})

router.get('/content/:id', (req, res) => {
  database.getSnippetContent(req.params.id).then(response => {
    res.send(JSON.stringify(response[0]))
  })
})

module.exports = router