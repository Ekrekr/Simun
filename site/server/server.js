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
  },
  putData: function putData (input) {
    return input
  },
  getData: function getData (input) {
    return input
  },
  updateData: function updateData (input) {
    return input
  },
  deleteData: function deleteData (input) {
    return input
  },
  connectToServer: function connectToServer () {

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

server.on('error', console.error)

// connect - Raised for all the ‘connect’ request by the HTTP client.
server.on('connect', (request, response) => {})

// connection - Emitted when a new TCP stream is established. Provide access to
// the socket established.
server.on('connection', (request, response) => {})

// upgrade -  each time a client requests an upgrade of the protocol (can be
// HTTP version).
server.on('upgrade', (request, response) => {})

/*****************************************/
/*               SERVER                  */
/*****************************************/

var path = require('path')

const express = require('express')
// const people = require('./people.json');

const app = express()

app.set('views', path.join(__dirname, '../models/public/views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Homepage'
    // user: 'something'
  })
})
connectToServer()

function connectToServer () {
  app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address()}`)
  })
}

/*****************************************/
/*              Database                */
/*****************************************/

const sqlite3 = require('sqlite3').verbose()
const dbPath = path.resolve(__dirname, '../database/database.db')
let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message)
  }
  console.log('Connected to the Login database.')
})
// GET
function getData (Table, lookup) {
  db.each(`SELECT *
                  FROM ` + Table + `
                  WHERE id = ?`, lookup, (err, row) => {
    if (err) {
      console.error(err.message)
    }
    console.log(row.id + '\t' + row.forename + '\t' +
      row.surname + '\t' + row.username + '\t' +
      row.password)
  })
  // });
}
// PUT
function putData (Table, forname, surname, username, password) {
  data = [forname, surname, username, password]
  var sqlPut = `INSERT INTO ` + Table + ` (forename, surname, username, password) VALUES (?,?,?,?)`
  console.log(sqlPut)

  db.run(sqlPut, data, function (err) {
    if (err) {
      return console.error(err.message)
    }
    console.log(`Rows inserted ${this.changes}`)
  })
}
// UPDATE
function updateData (Table, lookup, change) {
  data = [change, lookup]
  let sqlUpdate = `UPDATE ` + Table +
    `SET forename = ?
            WHERE id = ?`

  db.run(sqlUpdate, data, function (err) {
    if (err) {
      return console.error(err.message)
    }
    console.log(`Row(s) updated: ${this.changes}`)
  })
}
// DELETE
function deleteRow (Table, lookup) {
  db.run(`DELETE FROM ` + Table + ` WHERE id=?`, lookup, function (err) {
    if (err) {
      return console.error(err.message)
    }
    console.log(`Row(s) deleted ${this.changes}`)
  })
}

// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message)
  }
})
