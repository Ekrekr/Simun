var path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
const request = require('request')
var database = require('./database.js')

const app = express()
var router = express.Router()

// Enables REST communication with server.
app.use(bodyParser.urlencoded({extended: true}))
app.set('views', path.join(__dirname, '../models/public'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '../public')))
// app.use(bodyParser.json())
app.use('/', router)

async function connectToServer () {
  app.listen(7000, 'localhost', () => {
    console.log('Express running → localhost:7000')
  })
}

connectToServer()

module.exports = {
  connectToServer: connectToServer
}

/// ///////////////////////////////////////////////
// Non page requests.
/// ///////////////////////////////////////////////

router.get('/snippetcontent/:id', (req, res) => {
  console.log('Retrieving snippet content with id:', req.params.id)
  database.getSnippetContent(req.params.id).then(response => { 
    res.send(JSON.stringify(response[0]))
  })
})

router.post('/snippet/:method/', async (req, res) => {
  var snippetID = req.body.snippetid
  var redirectID = req.body.redirectid
  var method = req.params.method
  console.log('Performing method "' + method + '" on item in table with id', snippetID, 'by redirectID', redirectID)
  if (method == 'forward') {
    console.log('Forwarding snippet ' + snippetID)
    // TODO: Update this to take the actual username.
    // var result = await snippetLogic.forwardSnippet(snippetID, redirectID)
    var result = await snippetLogic.forwardSnippet(snippetID, 0)
    res.send(result)
  }
})

/// ///////////////////////////////////////////////
// Page requests.
/// ///////////////////////////////////////////////

router.get('/', (req, res) => {
  res.render('login')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', async (req, res) => {
  var username = req.body.username
  var password = req.body.password

  await async function(res, username, password) {
    database.getUserData('Login', username).then(res => {
      if (result.length > 0) {
        if (
          result[0].username === username &&
          result[0].password === password
        ) {
          res.render('index')
        } else {
          res.render('login')
        }
      } else {
        res.render('login')
      }
    })
  }
})

router.get('/receive', (req, res) => {
  var clientVariables = {}
  clientVariables.snippetcontents = []

  var redirectID = 0

  // Need to load snippet data from the database to display on the page.
  database.getRedirect(redirectID).then(redirect => {
    redirect = redirect[0]
    var snippets = JSON.parse(redirect.snippetids)

    // For each snippet, retrieve the snippet content ID.
    snippets.forEach((entry, index) => {
      database.getSnippet(entry).then(snippet => {
        snippet = snippet[0]

        // Retrieve the snippet content.
        database.getSnippetContent(snippet.contentid).then(snippetcontent => { 
          snippetcontent = snippetcontent[0]

          console.log("Rendering receive, snippetcontent.id: ", snippetcontent.id)

          clientVariables.snippetcontents.push({
            'description': snippetcontent.description,
            'content': snippetcontent.content,
            'id': snippetcontent.id,
            'parentid': snippet.id
          })

          // Only return final source if it's final iteration to prevent loss.
          if (index === snippets.length - 1) {
            // Send the created page back to user after loading all the variables,
            // with a slight delay to prevent further problems.
            setTimeout(function () {
              res.render('receive', clientVariables)
            }, 100)
          }
        })
      })
    })
  })
})

router.get('/send', (req, res) => {
  res.render('send')
})

router.get('/stats', (req, res) => {
  res.render('stats')
})
