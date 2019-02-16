var http = require('http')

// Called every time a request is received by the server. Receives and emits
// actions as a consequence. Event interfaces are:
// 'connect', 'connection', 'request', and 'upgrade'.
var server = http.createServer()

// Placeholder until real tests are needed. This is how to export functions for
// testing.
module.exports = {
  exampleFunc: function exampleFunc (input) {
    return !input
  }
}

// request - Emitted for Each request from the client (We would listen here).
server.on('request', (request, response) => {
  var body = []
  request
    .on('data', chunk => {
      body.push(chunk)
    })
    .on('end', () => {
      body = body.concat.toString()
      console.log('Server received ', body.toString())
    })
    .on('error', err => {
      console.error(err)
      response.statusCode = 400
      response.end()
    })

  response.on('error', err => {
    console.error(err)
  })

  response.statusCode = 200
  response.setHeader('Content-Type', 'application/json')
  response.write('Hello World!')
  response.end()
})

// connect - Raised for all the ‘connect’ request by the HTTP client.
server.on('connect', (request, response) => {
})

// connection - Emitted when a new TCP stream is established. Provide access to
// the socket established.
server.on('connection', (request, response) => {
})

// upgrade -  each time a client requests an upgrade of the protocol (can be
// HTTP version).
server.on('upgrade', (request, response) => {
})

server.listen(8008, () => {
  console.log('Server listening at 8008')
})

//Express Server Integration
var express = require("express"),
  app = express(),
  fs = require("fs"),
  path = require('path')

//Gets the file from the selected root directory
app.get('/', function (req, res){
  res.sendFile('index.html', {root : path.join(__dirname + '/../public') } )
})

//Location that the express server has been started at
app.listen(8080, function () {
  console.log('Express server started')
})