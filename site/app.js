var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var http = require('http')
var https = require('https')

// Load certificate and details for https.
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/simun.co.uk/privkey.pem', 'utf8')
var certificate = fs.readFileSync('/etc/letsencrypt/live/simun.co.uk/fullchain.pem', 'utf8')
var credentials = {key: privateKey, cert: certificate};

// Set up the node app.
var app = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.use(cookieParser())
app.use(express.static('./public'))
app.use('style', express.static('public/style'))
app.use(bodyParser.json({limit: '10mb'}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require('./controllers'))

// Create the server and listen.
var httpServer = http.createServer(app)
var httpsServer = https.createServer(credentials, app)

httpServer.listen(8080)
httpsServer.listen(8443)