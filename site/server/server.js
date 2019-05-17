var path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var database = require('./database.js')
var jwtservice = require('./jwtservice.js')
var identifiers = require('./identifiers.js')

/// ///////////////////////////////////////////////
// Start app and express settings, then start the server.
/// ///////////////////////////////////////////////

const server = express()
var router = express.Router()

// Enables REST communication with server.
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(cookieParser())
server.use(express.static(path.join(__dirname, '../public')))
server.set('views', path.join(__dirname, '../models/public'))
server.set('view engine', 'pug')

server.use((req, res, next) => {
  next()
})

async function connectToServer () {
  server.listen(7000, 'localhost', () => {
    console.log('server: Express running → localhost:7000')
  })
}

connectToServer()

/// ///////////////////////////////////////////////
// Generic functions.
/// ///////////////////////////////////////////////

function isLoggedIn (req, res) {
  var cookie = Object.keys(req.cookies)['session']
  if (cookie === undefined) {
    console.log('No cookie found')
    res.render('login')
    return false
  }
  console.log('Cookie exists:', cookie)
  return true
}

/// ///////////////////////////////////////////////
// Non page requests.
/// ///////////////////////////////////////////////

server.get('/snippetcontent/:id', (req, res) => {
  console.log('server: Retrieving snippet content with id:', req.params.id)
  database.getSnippetContent(req.params.id).then(response => {
    res.send(JSON.stringify(response[0]))
  })
})

server.post('/forward-snippet/', (req, res) => {
  console.log('server: Forwarding snippet id:', req.body.snippetid)
  database.forwardSnippet(req.body.snippetid).then(res => {
    return res
  })
})

server.post('/create-snippet/', (req, res) => {
  console.log('server: Creating snippet with content:', req.body.content, 'description:', req.body.description, 'redirectid:', req.body.redirectid)
  database.createSnippet(req.body.content, req.body.description, req.body.redirectid).then(res => {
    return res
  })
})

/// ///////////////////////////////////////////////
// Page requests.
/// ///////////////////////////////////////////////

server.get('/', (req, res) => {
  if (!isLoggedIn(req, res)) { return }
  res.render('index')
})

server.get('/login', (req, res) => {
  res.render('login')
})

server.post('/login', async (req, res) => {
  // TODO: This password should be encrypted before being received here.
  console.log('Attempting to log in with username', req.body.username, 'and password', req.body.password)
  database.getUserData(req.body.username).then(result => {
    console.log('result back from server:', result)
    if (result.length > 0) {
      if (
        result[0].username === req.body.username &&
        result[0].password === req.body.password
      ) {
        res.render('index')
      } else {
        res.render('login')
      }
    } else {
      res.render('login')
    }
  })
})

server.get('/register', (req, res) => {
  res.render('register')
})

server.post('/register', async (req, res) => {
  console.log('Attempting to register account with username', req.body.username + ', password', req.body.password, 'and alias', req.body.alias)

  // Create a redirect to attach to the user details.
  var redirectID = await database.createRedirect(req.body.alias, 1, true).then(res => { return res })

  // Create an account pointing to the redirect
  var userID = await database.createUser(req.body.username, req.body.password, redirectID, true).then(res => { return res })
  if (userID === identifiers.duplicateID) {
    console.log("duplicate ID found. TODO: Add graphic response here to say already taken.")
    res.render('register')
    return
  }

  // Create a token so that the user doesn't have to log in again for a while.
  var token = await jwtservice.sign({ username: req.body.username })
  console.log('Account registered, sending cookie and returning to index.')

  // Return the token in a delicious cookie.
  res.cookie('session', token)

  res.render('index')
})

server.get('/receive', (req, res) => {
  if (!isLoggedIn(req, res)) { return }
  
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

          console.log('server: Rendering receive, snippetcontent.id: ', snippetcontent.id)

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

server.get('/send', (req, res) => {
  if (!isLoggedIn(req, res)) { return }

  console.log('Cookies: ', req.cookies.cookieName)
  res.render('send')
})

server.get('/stats', (req, res) => {
  res.render('stats')
})
