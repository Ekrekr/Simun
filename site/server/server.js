var path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
var database = require('./database.js')
var Cookies = require('cookies')
const app = express()
var router = express.Router()
const request = require('request')
const jwt = require('jsonwebtoken')
const config = require('./config.js')
var cookieParser = require('cookie-parser')
// var middleware = require('./middleware.js')
var passport = require("passport")
var passportJWT = require("passport-jwt")
var extractJWT = passportJWT.ExtractJwt
var jwtStrategy = passportJWT.Strategy
module.exports = {
    connectToServer: connectToServer
}
connectToServer()

// ***************** Authentication Middleware **************** //
// This is what every request to the server will have to go through first
// Before it can get through to it's respective request

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
// Used to check current user against the cookie token
router.use(function (req, res, next) {
    // console.log("Gets Here123")
    // var tokens = req.body.token || req.query.token || req.headers['x-access-token']
    // console.log("Tokens:")
    // console.log(tokens)
    next()
})

async function connectToServer() {
    app.listen(7000, 'localhost', () => {
        console.log('server: Express running → localhost:7000')
    })
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
    try {
        var token = new Cookies(req, res).get('auth')
        let decoded = jwt.decode(token, config.secret)
        verifyUser(res, res, decoded.data)
    } catch (e) {
        res.render('login')
    }
})

router.get('/login', (req, res) => {
    try {
        var token = new Cookies(req, res).get('auth')
        let decoded = jwt.decode(token, config.secret)
        verifyUser(res, res, decoded.data)
    } catch (e) {
        res.render('login')
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

// Login authentication
// Gets the username and password of input and calls authentication function
router.post('/login', async function (req, res) {
    var username = req.body.username
    var password = req.body.password
    await authenticate(res, req, username, password)
})

async function verifyUser(res, req, username) {
    console.log(username)
    let sqlQuery = 'SELECT * FROM Login WHERE username = ?'
    let sqlData = username
    var authentication = database.sqlGet(sqlQuery, sqlData, false)
    authentication.then(async function (result) {
        if (result.length > 0) {
            if (
                result[0].username === username
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

// Authenticates username and password for login
async function authenticate(res, req, username, password) {
    let sqlQuery = 'SELECT * FROM Login WHERE username = ?'
    let sqlData = username
    var authentication = database.sqlGet(sqlQuery, sqlData, false)
    authentication.then(async function (result) {
        if (result.length > 0) {
            if (
                result[0].username === username
            ) {
                generateJWT(res, req, username)
                res.render('index')
            } else {
                res.render('login')
            }
        } else {
            res.render('login')
        }
    })
}

function generateJWT(res, req, username) {
    var token = jwt.sign({
        data: username
    }, config.secret, {
        expiresIn: '1h'
    }, {
        algorithm: 'RS256'
    })
    res.cookie('auth', token)
}

router.get('/send', function (req, res) {
    res.render('send')
})

router.get('/stats', function (req, res) {
    res.render('stats')
})

app.use('/', router)