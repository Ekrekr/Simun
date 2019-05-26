var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var http = require('http')
var https = require('https')
var fs = require('fs')

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
httpServer.listen(8080)

// Load certificate and details for https. Catch used in case running locally.
try {
  var privateKey  = fs.readFileSync('/etc/letsencrypt/live/simun.co.uk/privkey.pem', 'utf8')
  var certificate = fs.readFileSync('/etc/letsencrypt/live/simun.co.uk/fullchain.pem', 'utf8')
  var credentials = {key: privateKey, cert: certificate};
  var httpsServer = https.createServer(credentials, app)
  httpsServer.listen(8443)
} catch {
  console.log('Error starting https server; credentials not found')
}