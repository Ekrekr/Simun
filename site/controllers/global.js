var express = require('express')
var router = require('express').Router()

router.get('/', async (req, res) => {
  res.render('global')
})

module.exports = router