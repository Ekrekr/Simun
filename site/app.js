const express = require('express')
var session = require('express-session');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()

// Enables REST communication with server.
app.set('views', './views')
app.set('view engine', 'pug')

app.use(cookieParser())
app.use(express.static('./public'))
app.use('style', express.static('public/style'))
app.use(bodyParser.json({limit: '10mb'}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require('./controllers'))

app.listen(7000, 'localhost', () => {console.log('server: Express running → localhost:7000')})