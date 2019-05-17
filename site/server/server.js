var path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
var database = require('./database.js')
var database = require('jwtservice.js')
var identifier = require('identifier.js')

/// ///////////////////////////////////////////////
// Start app and express settings, then start the server.
/// ///////////////////////////////////////////////

const app = express()
var router = express.Router()

// Enables REST communication with server.
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, '../models/public'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json())
app.use('/', router)

async function connectToServer () {
  app.listen(7000, 'localhost', () => {
    console.log('server: Express running → localhost:7000')
  })
}

connectToServer()

/// ///////////////////////////////////////////////
// Non page requests.
/// ///////////////////////////////////////////////

router.get('/snippetcontent/:id', (req, res) => {
  console.log('server: Retrieving snippet content with id:', req.params.id)
  database.getSnippetContent(req.params.id).then(response => {
    res.send(JSON.stringify(response[0]))
  })
})

router.post('/forward-snippet/', (req, res) => {
  console.log('server: Forwarding snippet id:', req.body.snippetid)
  database.forwardSnippet(req.body.snippetid).then(res => {
    return res
  })
})

router.post('/create-snippet/', (req, res) => {
  console.log('server: Creating snippet with content:', req.body.content, 'description:', req.body.description, 'redirectid:', req.body.redirectid)
  database.createSnippet(req.body.content, req.body.description, req.body.redirectid).then(res => {
    return res
  })
})

/// ///////////////////////////////////////////////
// Page requests.
/// ///////////////////////////////////////////////

router.get('/', (req, res) => {
  // TODO: Update this to be the stats page for initial newcomers.
  res.render('index')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', async (req, res) => {
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

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  console.log('Attempting to register account with username', req.body.username + ', password', req.body.password, 'and alias', req.body.alias)

  // Create a redirect to attach to the user details.
  var redirectID = await database.createRedirect(req.body.alias, 1, true).then(res => { return res })
  redirect = await database.getRedirect(redirectID, true).then(res => { return res[0] })

  // Create an account pointing to the redirect
  userID = await database.createUser(req.body.username, req.body.password, redirectID, true).then(res => { return res })

  // Create a token so that the user doesn't have to log in again for a while.
  token = jwtservice.sign({ username: req.body.username })

  // Return the token in a delicious cookie.
  res.cookie(req.body.username, token)
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

router.get('/send', (req, res) => {
  res.render('send')
})

router.get('/stats', (req, res) => {
  res.render('stats')
})
