var path = require('path')
const express = require('express')
var database = require('./database.js')
const fetch = require('node-fetch')

const app = express()

app.set('views', path.join(__dirname, '../models/public'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '../public')))

// Page retrieval
app.get('/', (req, res) => {
  res.render('index.html')
})

app.get('/login', (req, res) => {
  res.render('login.html')
})

app.get('/receive', (req, res) => {
  res.render('receive', {
    snippets: 
    [{'description': 'example 1', 'content': 'assets/images/snippet-example-1.png'},
    {'description': 'example 2', 'content': 'assets/images/snippet-example-2.png'}]
  });
})

app.get('/send', (req, res) => {
  res.render('send.html')
})

app.get('/stats', (req, res) => {
  res.render('stats.html')
})

// Snippet handling
app.get('/data/:table/:id', (req, res) => {
  console.log('Retrieving data from table "' + req.params.table + '" and id', req.params.id)

  database.getData(req.params.table, req.params.id).then( response => {
    res.send(JSON.stringify(response[0]))
  });
})

// Start the server.
app.listen(7000, () => {
  console.log('Server started on port 7000')
})
