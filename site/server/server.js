var path = require('path')
const express = require('express')
var database = require('./database.js')
const request = require('request')

const app = express()

app.set('views', path.join(__dirname, '../models/public'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '../public')))

// Retrieve data from the database
app.get('/data/:table/:id', (req, res) => {
  console.log('Retrieving data from table "' + req.params.table + '" and id', req.params.id)

  database.getData(req.params.table, req.params.id).then(response => {
    res.send(JSON.stringify(response[0]))
  })
})

// Retrieves data by asking the server for it.
function retrieveData (table, id, _callback) {
  request('http://localhost:7000/data/' + table + '/' + id, { json: true }, (err, res, body) => {
    if (err) { return _callback(err) }
    return _callback(null, JSON.parse(JSON.stringify(body)))
  })
}

// Page retrieval
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/receive', (req, res) => {
  // File to pass to pug to tell it what value to give variables.
  var variables = {}
  variables.selected = {}
  variables.snippets = []

  // Need to load snippet data from the database to display on the page.
  retrieveData('redirect', 0, (err, redirect) => {
    if (err) {
      console.log('Error retrieving redirect from server:', err)
      return
    }

    var snippets = JSON.parse(redirect.snippetids)

    // For each snippet, retrieve the snippet content ID.
    snippets.forEach((entry, index) => {
      retrieveData('snippets', entry, (err, snippet) => {
        if (err) {
          console.log('Error retrieving snippets from server:', err)
          return
        }

        // Retrieve the snippet content.
        retrieveData('snippetcontent', snippet.contentid, (err, snippetcontent) => {
          if (err) {
            console.log('Error retrieving snippetcontent from server:', err)
            return
          }

          variables.snippets.push({ 'description': snippetcontent.description,
            'content': snippetcontent.content,
            'id': snippetcontent.id })

          // Only return final source if final iteration.
          if (index === snippets.length - 1) {
            // Send the created page back to user after loading all the variables,
            // with a slight delay to prevent further problems.
            setTimeout(function () { res.render('receive', variables) }, 100)
          }
        })
      })
    })
  })
})

app.get('/send', (req, res) => {
  res.render('send')
})

app.get('/stats', (req, res) => {
  res.render('stats')
})

app.get('/receive.js', (req, res) => {
  res.sendfile('scripts/receive.js')
})

// Start the server.
app.listen(7000, () => {
  console.log('Server started on port 7000')
})
