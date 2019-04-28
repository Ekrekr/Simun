var path = require('path')
const express = require('express')
const app = express()
var router = express.Router()
var bodyParser = require('body-parser')
var database = require('./database.js')
const request = require('request')
const jwt = require('jsonwebtoken')

const config = require('./config.js');
// parse requests
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.set('views', path.join(__dirname, '../models/public'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json())

router.get('/receive.js', (req, res) => {
  res.sendfile('scripts/receive.js')
})

// Retrieve data from the database
router.get('/data/:table/:id', (req, res) => {
  console.log('Retrieving data from table "' + req.params.table + '" and id', req.params.id)
  // if (req.params.table === 'snippetcontent') {
  database.getData(req.params.table, req.params.id).then(response => {
    res.send(JSON.stringify(response[0]))
  })
  // } else {
  //   res.send(null)
  // }
})

// Retrieves data by asking the server for it.
function retrieveData(table, id, _callback) {
  request('http://localhost:7000/data/' + table + '/' + id, {
    json: true
  }, (err, res, body) => {
    if (err) {
      return _callback(err)
    }
    return _callback(null, JSON.parse(JSON.stringify(body)))
  })
}

router.get('/receive', (req, res) => {
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

          variables.snippets.push({
            'description': snippetcontent.description,
            'content': snippetcontent.content,
            'id': snippetcontent.id
          })

          // Only return final source if final iteration.
          if (index === snippets.length - 1) {
            // Send the created page back to user after loading all the variables,
            // with a slight delay to prevent further problems.
            setTimeout(function () {
              res.render('receive', variables)
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

router.get('/', function (req, res) {
  res.render('login')
})

// Login authentication
// Gets the username and password of input and calls authentication function
router.post('/login', async function (req, res) {
  var username = req.body.username
  var password = req.body.password
  await authenticate(res, username, password)
})

// Authenticates username and password for login
async function authenticate(res, username, password) {
  var salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 7)
  let token = jwt.sign({
      username,
      password
    },
    config.secret, {
      expiresIn: '24h'
    })
  var authentication = database.getUserData('login', username)
  authentication.then(async function (result) {
    var resulted = await database.compareHash(password + result[0].salt, password)
    if (result.length > 0) {
      if (
        result[0].username == username &&
        await database.compareHash(password + result[0].salt, result[0].password)
      ) {
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        })
        res.render('index')
      } else {
        res.json({
          success: false,
          message: 'Authentication unsuccessful!',
          token: token
        })
        res.render('login')
      }
    } else {
      res.json({
        success: false,
        message: 'Authentication unsuccessful!',
        token: token
      })
      res.render('login')
    }
  })
}

function generateJWT(res, username, password) {
  let token = jwt.sign({
      username,
      password
    },
    config.secret, {
      expiresIn: '24h'
    })
  res.json({
    success: true,
    message: 'Authentication successful',
    token: token
  })

}

router.get('/login', function (req, res) {
  res.render('login')
})

router.get('/send', function (req, res) {
  res.render('send')
})

router.get('/stats', function (req, res) {
  res.render('stats')
})

router.get('/index', function (req, res) {
  res.render('index')
})

app.use('/', router)

connectToServer()

async function connectToServer() {
  app.listen(7000, () => {
    console.log(`Express running → PORT 7000`)
  })
}

module.exports = {
  connectToServer: connectToServer
}