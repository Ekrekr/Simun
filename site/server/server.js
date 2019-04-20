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
  res.sendfile('index.html')
})

app.get('/login', (req, res) => {
  res.sendfile('login.html')
})

app.get('/receive', (req, res) => {
  res.sendfile('receive.html')
})

app.get('/send', (req, res) => {
  res.sendfile('send.html')
})

app.get('/stats', (req, res) => {
  res.sendfile('stats.html')
})

// Snippet handling
app.get('/data/:table/:id', (req, res) => {
  console.log('Retrieving data from table "' + req.params.table + '" and id', req.params.id)

  database.getData(req.params.table, req.params.id).then( response => {
    res.send(JSON.stringify(response[0]))
  });
})

app.get('/snippets/:id', (req, res) => {
  console.log('Retrieving snippet content for snippet id:', req.params.id)

  database.getData('redirect', req.params.id).then( response => {
    var snippetids = JSON.parse(JSON.stringify(response[0])).snippetids
    var str = JSON.stringify(snippetids)
    res.send(str)
  });


  var snippetInfo = database.getData('snippets', req.params.snippetID)
  snippetList.then( () => {
    console.log('Snippets info:', snippetInfo)
    // var snippetID = 
  })
})

// Start the server.
app.listen(7000, () => {
  console.log('Server started on port 7000')
})
