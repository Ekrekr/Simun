var path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
const request = require('request')
var database = require('./database.js')
var snippetLogic = require('./snippet-logic.js')

const app = express()
var router = express.Router()

// Retrieves data from the database.
function retrieveData (table, id, _callback) {
  request('http://localhost:7000/data/' + table + '/' + id, {
    json: true
  }, (err, res, body) => {
    if (err) {
      return _callback(err)
    }
    return _callback(null, JSON.parse(JSON.stringify(body)))
  })
}

// Authenticates username and password for login.
async function authenticate (res, username, password) {
  var authentication = database.getUserData('Login', username)
  authentication.then(async function (result) {
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

// Enables REST communication with server.
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.set('views', path.join(__dirname, '../models/public'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json())

router.get('/data/:table/:id', (req, res) => {
  console.log('Retrieving data from table "' + req.params.table + '" and id', req.params.id)
  database.getData(req.params.table, req.params.id).then(response => {
    res.send(JSON.stringify(response[0]))
  })
})

router.post('/snippet/:method/', (req, res) => {
  var snippetID = req.body.id
  var method = req.params.method
  console.log('Performing method "' + method + '" on item in table with id', snippetID)
  if (method == "forward") {
    console.log('Forwarding snippet ' + snippetID)
    snippetLogic.forwardSnippet(snippetID)
  }
})

router.get('/', function (req, res) {
  res.render('login')
})

router.get('/login', function (req, res) {
  res.render('login')
})

router.post('/login', async function (req, res) {
  var username = req.body.username
  var password = req.body.password
  await authenticate(res, username, password)
})

router.get('/receive', (req, res) => {
  var clientVariables = {}
  clientVariables.snippetcontents = []

  // Need to load snippet data from the database to display on the page.
  retrieveData('redirect', 0, (err, redirect) => {
    if (err) {
      console.log('Error retrieving redirect from server:', err)
      return
    }

    var snippets = JSON.parse(redirect.snippetids)

    // For each snippet, retrieve the snippet content ID.
    snippets.forEach((entry, index) => {
      retrieveData('snippet', entry, (err, snippet) => {
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

router.get('/stats', function (req, res) {
  res.render('stats')
})

// router.get('/scripts', function (req, res) {
//   res.render('login')
// })

app.use('/', router)

connectToServer()

async function connectToServer () {
  app.listen(7000, () => {
    console.log(`Express running → PORT 7000`)
  })
}

module.exports = {
  connectToServer: connectToServer
}
