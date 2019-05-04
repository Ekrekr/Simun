var path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
var database = require('./database.js')

const app = express()
var router = express.Router()
const request = require('request')
const jwt = require('jwt-simple')
const config = require('./config.js')
var cookieParser = require('cookie-parser')
// parse requests
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

// Enables REST communication with server.
app.use(bodyParser.urlencoded({
  extended: true
}))
app.set('views', path.join(__dirname, '../models/public'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '../public')))
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/', router)
// router.use(function (req, res, next) {
//   console.log('Here')
//   try {
//     console.log('Gets here at least ' + req.json)
//     // const token = req.json.split(" ")[1]
//     jwt.verify(token, config.secret, function (err, result) {
//       console.log('Rip ' + result)
//       if (result) {
//         database.getUserData('login', result[0].username).then((result) => {
//           req.body.username = result[0].username
//           req.body.password = result[0].password
//           req.body.salt = result[0].salt
//           req.session.save()
//           res.redirect('./index')
//           next()
//         })
//       } else {
//         console.log('Gets here too I guess ')
//         next()
//       }
//     })
//   } catch (e) {
//     console.log(e + 'Oopsies')
//     next()
//   }
// })

async function connectToServer () {
  app.listen(7000, 'localhost', () => {
    console.log('server: Express running → localhost:7000')
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
  res.render('login')
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
        database.compareHash(req.body.password + result[0].salt, result[0].password)
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
// Retrieves data by asking the server for it.
function retrieveData (table, id, _callback) {
  request('http://localhost:7000/data/' + table + '/' + id, {
    json: true
  }, (err, res, body) => {
    if (err) {
      return _callback(err)
    }
  })
}

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
  router.get('/', function (req, res) {
    res.render('login')
  })
})

// Login authentication
// Gets the username and password of input and calls authentication function
router.post('/login', async function (req, res) {
  var username = req.body.username
  var password = req.body.password
  await authenticate(res, req, username, password)
})

// Authenticates username and password for login
async function authenticate (res, req, username, password) {
  // let token = jwt.sign({
  //   username,
  //   password
  // },
  // config.secret, {
  //   expiresIn: '24h'
  // })
  var authentication = database.getUserData('login', username)
  authentication.then(async function (result) {
    if (result.length > 0) {
      if (
        result[0].username === username &&
        await database.compareHash(password + result[0].salt, result[0].password)
      ) {
        // var token = jwt.encode({
        //     data: {
        //       username: username,
        //       password: result[0].password
        //     }
        //   },
        //   config.secret, {
        //     expiresIn: '24h'
        //   }
        // )
        // req.header.authorization = token
        res.render('index')
        // req.header.save()
        // res.json(token)
      } else {
        res.render('login')
      }
    } else {
      res.render('login')
    }
  })
}

function generateJWT (res, username, password) {
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
  if (req.user) {
    database.getUserData('login', req.user.username).then((result) => {
      if (result[0].username === req.user.username) {
        res.render('index')
      }
    })
  }
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

module.exports = {
  connectToServer: connectToServer
}
