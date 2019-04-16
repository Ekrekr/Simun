var http = require('http')

// Called every time a request is received by the server. Receives and emits
// actions as a consequence. Event interfaces are:
// 'connect', 'connection', 'request', and 'upgrade'.
var server = http.createServer()
// Placeholder until real tests are needed. This is how to export functions for
// testing.
module.exports = {
  connectDatabase: function connectDatabase() {},
  exampleFunc: function exampleFunc(input) {
    return !input
  },
  putData: putData,
  getData: getData,
  updateData: updateData,
  deleteRow: deleteRow,
  connectToServer: function connectToServer() {}
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

function connectToServer() {
  app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address()}`)
  })
}

/*****************************************/
/*              Database                */
/*****************************************/
const sqlite3 = require('sqlite3').verbose()
const dbPath = path.resolve(__dirname, '../database/database.db')

function connectDatabase() {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(err.message)
    }
    console.log('Connected to the Login database.')
  })
}
let db = connectDatabase()
// GET

var getResult = []

function getData(Table, lookup) {
  // console.log('Gets Here')
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.all(`SELECT *
                  FROM ` + Table + `
                  WHERE id = ?`, lookup, function (err, rows) {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  })
}
// PUT
function putData(Table, forname, surname, username, password) {
  data = [forname, surname, username, password]
  var sqlPut = `INSERT INTO ` + Table + ` (forename, surname, username, password) VALUES (?,?,?,?)`
  return new Promise(function (resolve, reject) {
    db.run(sqlPut, data, function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(`Rows inserted ${this.changes}`)
      }
      // console.log(putResult)
    })
  })
}
// UPDATE
var updateResult = ''

function updateData(Table, lookup, change) {
  let data = [change, lookup]
  let sqlUpdate = `UPDATE Login
    SET forename = ?
    WHERE forename = ?`
  return new Promise(function (resolve, reject) {
    db.run(sqlUpdate, data, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve(`Row(s) updated: ${this.changes}`)
      }
    })
  })
}


// DELETE
// Lookup all tables
var deleteResult = ''

function deleteRow(Table, lookup) {
  return new Promise(function (resolve, reject) {
    db.run(`DELETE FROM ` + Table + ` WHERE forename=?`, lookup, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve(`Row(s) deleted ${this.changes}`)
      }
    })
  })
}

// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message)
  }
})

// module.exports = getData