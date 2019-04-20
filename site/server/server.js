var http = require('http')
var server = http.createServer()

// Export functions
module.exports = {
  connectDatabase: function connectDatabase() {},
  exampleFunc: function exampleFunc(input) {
    return !input
  },
  putData: putData,
  getData: getData,
  updateData: updateData,
  deleteRow: deleteRow
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

const app = express()
var router = express.Router();

app.set('views', path.join(__dirname, '../models/public'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '../public')))

router.use(function (req, res, next) {
  next()
})

router.get('/', (req, res) => {
  res.send('I am the Home page!')
})

router.get('/login.html', (req, res) => {
  res.send('I am the Login page!')
})


router.get('/receive', (req, res) => {
  res.send('I am the Receive page!')
})

router.get('/send', (req, res) => {
  res.send('I am the Send page!')
})

router.get('/stats', (req, res) => {
  res.send('I am the Stats page!')
})

router.get('/menu', (req, res) => {
  res.send('I am the Menu page!')
})

// app.use('/', router)

connectToServer()

function connectToServer() {
  app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address()}`)
  })
}

/*****************************************/
/*              DATABASE                 */
/*****************************************/
const sqlite3 = require('sqlite3').verbose()
const dbPath = path.resolve(__dirname, '../database/database.db')
let sqlAll = db.prepare(`SELECT *
                  FROM ?
                  WHERE id = ?`)
let sqlPut = db.prepare(`INSERT INTO ? (forename, surname, username, password) VALUES (?,?,?,?)`)
let sqlUpdate = db.prepare(`UPDATE ?
    SET forename = ?
    WHERE forename = ?`)
let sqlDelete = db.prepare(`DELETE FROM ? WHERE forename=?`)

function connectDatabase() {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(err.message)
    }
    console.log('Connected to the Login database.')
  })
}
// let db = connectDatabase()
// close the database connection
function closeDatabase(db) {
  db.finalize()
  db.close((err) => {
    if (err) {
      return console.error(err.message)
    }
  })
}
// GET
function getData(Table, lookup) {
  let db = connectDatabase()
  let data = [Table, lookup]
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.all(sqlAll, data, function (err, rows) {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  })
  closeDatabase(db)
}

// PUT
function putData(Table, forname, surname, username, password) {
  let db = connectDatabase()
  var data = [Table, forname, surname, username, password]
  return new Promise(function (resolve, reject) {
    db.run(sqlPut, data, function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(`Rows inserted ${this.changes}`)
      }
    })
  })
  closeDatabase(db)
}

// UPDATE
function updateData(Table, lookup, change) {
  let db = connectDatabase()
  let data = [Table, change, lookup]
  return new Promise(function (resolve, reject) {
    db.run(sqlUpdate, data, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve(`Row(s) updated: ${this.changes}`)
      }
    })
  })
  closeDatabase(db)
}

// DELETE
function deleteRow(Table, lookup) {
  let db = connectDatabase()
  return new Promise(function (resolve, reject) {
    db.run(sqlDelete, lookup, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve(`Row(s) deleted ${this.changes}`)
      }
    })
  })
  closeDatabase(db)
}