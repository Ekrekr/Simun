const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const database = require('./database.js')
const jwtservice = require('./jwtservice.js')
const identifiers = require('./identifiers.js')

const app = express()

// Enables REST communication with server.
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

app.use(require('./controllers'))

app.listen(7000, 'localhost', () => {})

async function connectToServer () {
  server.listen(7000, 'localhost', () => {
    console.log('server: Express running → localhost:7000')
  })
}

connectToServer()

/// ///////////////////////////////////////////////
// Link the server to different routes.
/// ///////////////////////////////////////////////

/// ///////////////////////////////////////////////
// Generic functions.
/// ///////////////////////////////////////////////

async function sendSessionCookie (req, res, alias, redirectID) {
  // Create a token so that the user doesn't have to log in again for a while,
  // return the token in a delicious cookie.
  var token = await jwtservice.sign({ alias: alias, redirectid: redirectID })
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
    var redirectID = await database.getUserRedirectID(req.body.username).then(res => { return res })
    console.log('login redirectID:', redirectID)
    var redirect = await database.getRedirect(redirectID).then(res => { return res[0] })
    console.log('login redirect:', redirect)
    await sendSessionCookie(req, res, redirect.alias, redirectID)
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

server.get('/send', (req, res) => {
  if (!checkSessionCookie(req, res)) { return }
  res.render('send')
})

server.get('/stats', (req, res) => {
  res.render('stats')
})
