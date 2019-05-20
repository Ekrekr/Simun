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

function checkSessionCookie (req, res) {
  // If there is no cookie, then send to login page.
  if (req.cookies['session'] === undefined) {
    res.redirect('login')
    return false
  }

  // Verify the cookie, if it is not valid then delete the cookie and return to the login page.
  var decodedCookie = jwtservice.verify(req.cookies['session'])
  if (decodedCookie === false) {
    res.clearCookie('session')
    res.redirect('login')
    return false
  }
  return decodedCookie
}

async function sendSessionCookie (req, res, username, redirectID) {
  // Create a token so that the user doesn't have to log in again for a while,
  // return the token in a delicious cookie.
  var token = await jwtservice.sign({ username: username, redirectid: redirectID })
  res.cookie('session', token)
}

/// ///////////////////////////////////////////////
// Non page requests.
/// ///////////////////////////////////////////////

server.get('/snippet/:id', (req, res) => {
  console.log('server: Retrieving snippet with id:', req.params.id)
  database.getSnippet(req.params.id).then(response => {
    res.send(JSON.stringify(response[0]))
  })
})

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
  if (!checkSessionCookie(req, res)) { return }
  res.redirect('index')
})

server.get('/index', (req, res) => {
  if (!checkSessionCookie(req, res)) { return }
  res.render('index')
})

server.get('/login', (req, res) => {
  if (req.cookies['session'] !== undefined) {
    res.redirect('index')
  }
  res.render('login')
})

server.post('/login', async (req, res) => {
  console.log('Attempting to log in with username', req.body.username, 'and password', req.body.password)

  var isValid = await database.authenticateUser(req.body.username, req.body.password).then(res => { return res })
  if (isValid) {
    // Create a token so that the user doesn't have to log in again for a while,
    // return the token in a delicios cookie.
    var redirectID = await database.getUserRedirectID(req.body.username)
    await sendSessionCookie(req, res, req.body.username, redirectID)
    res.redirect('index')
  } else {
    // TODO: Update this with notification of incorrect credentials.
    console.log('Incorrect password. TODO: Add graphic response here to say already taken.')
    res.render('login')
  }
})

server.get('/logout', (req, res) => {
  res.clearCookie('session')
  res.redirect('login')
})

server.get('/register', (req, res) => {
  res.render('register')
})

server.post('/register', async (req, res) => {
  console.log('Attempting to register account with username', req.body.username + ', password', req.body.password, 'and alias', req.body.alias)

  // Create a redirect to attach to the user details.
  var redirectID = await database.createRedirect(req.body.alias, 1).then(res => { return res })

  // Create an account pointing to the redirect
  var userID = await database.createUser(req.body.username, req.body.password, redirectID).then(res => { return res })
  if (userID === identifiers.duplicateID) {
    console.log('duplicate ID found. TODO: Add graphic response here to say already taken.')
    res.render('register')
    return
  }

  await sendSessionCookie(req, res, req.body.username, redirectID)

  res.redirect('index')
})

server.get('/receive', async (req, res) => {
  if (!checkSessionCookie(req, res)) { return }
  console.log('Loading receive page.')

  var decodedCookie = checkSessionCookie(req, res)
  if (!decodedCookie) { return }

  var redirectID = decodedCookie.redirectid

  var clientVariables = {}
  clientVariables.snippets = []

  // Need to load snippet data from the database to display on the page.
  var redirect = await database.getRedirect(redirectID).then(res => { return res[0] })
  var snippets = JSON.parse(redirect.snippetids)

  // If no snippets found, then render an empty receive page.
  if (snippets.length === 0) {
    res.render('receive', clientVariables)
    return
  }

  // For each snippet, retrieve the snippet content ID.
  await snippets.forEach(async (entry, index) => {
    var snippet = await database.getSnippet(entry).then(res => { return res[0] })

    var snippetcontent = await database.getSnippetContent(snippet.contentid).then(res => { return res[0] })
    console.log("Entry:", entry, 'server: Rendering receive, snippetcontent.id: ', snippetcontent.id)

    clientVariables.snippets.push({
      'description': snippetcontent.description,
      'content': snippetcontent.content,
      'snippetid': snippet.id,
      'comments': snippet.comments
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

server.get('/send', (req, res) => {
  if (!checkSessionCookie(req, res)) { return }
  res.render('send')
})

server.get('/stats', (req, res) => {
  res.render('stats')
})
