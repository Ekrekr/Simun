var path = require('path')
const express = require('express')
var database = require('./database.js')

let db = database.connectDatabase()

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
app.get('/snippet-list', (req, res) => {
  // console.log('Retrieving snippet list for user', req.params.userID);
  // var snippetList = getData('Redirect', req.params.userID);
  // console.log('Snippets for for user', req.params.userID, ':', snippetList);
  // obj = "TEST123";
  // response.write(JSON.stringify(obj));
  res.send('TEST123')
})

app.listen(7000, () => {
  console.log('Server started on port 7000')
})
