var path = require('path')
const sqlite3 = require('sqlite3').verbose()
const dbPath = path.resolve(__dirname, '../database/database.db')
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {
  connectDatabase: function connectDatabase () {},
  putData: putData,
  getData: getData,
  getUserData: getUserData,
  updateData: updateData,
  deleteRow: deleteRow,
  hashingEntry: hashingEntry,
  compareHash: compareHash
}

// Hashes input
async function hashingEntry (entry) {
  return bcrypt.hashSync(entry, saltRounds)
}

// Compares the hash and plaintext of inputs
async function compareHash (plaintext, hash) {
  return bcrypt.compareSync(plaintext, hash)
}

// Connect to the database
function connectDatabase () {
  return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message)
    }
    console.log('Connected to the Login database.')
  })
}

// Close the database connection
function closeDatabase (db) {
  db.close((err) => {
    if (err) {
      return console.error(err.message)
    }
  })
}

// GET data from database
function getData (table, lookup) {
  let db = connectDatabase()
  let sqlGet = `SELECT *
                  FROM ` + table + `
                  WHERE id = ?`
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.all(sqlGet, lookup, function (err, rows) {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
      closeDatabase(db)
    })
  })
}

// GET function for login functionality
function getUserData (table, lookup) {
  let db = connectDatabase()
  let sqlGet = `SELECT *
                  FROM Login
                  WHERE username = ?`
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.all(sqlGet, lookup, function (err, rows) {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
      closeDatabase(db)
    })
  })
}

// PUT data from database
function putData (table, forname, surname, username, password) {
  var data = [forname, surname, username, password]
  var sqlPut = `INSERT INTO login (forename, surname, username, password) VALUES (?,?,?,?)`

  let db = connectDatabase()
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.run(sqlPut, data, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(`Rows inserted ${this.changes}`)
        }
      })
      closeDatabase(db)
    })
  })
}

// UPDATE data from database
function updateData (table, lookup, change) {
  let data = [change, lookup]
  let db = connectDatabase()
  let sqlUpdate = `UPDATE login
    SET forename = ?
    WHERE forename = ?`
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.run(sqlUpdate, data, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(`Row(s) updated: ${this.changes}`)
        }
      })
      closeDatabase(db)
    })
  })
}

// DELETE data from database
function deleteRow (table, lookup) {
  let db = connectDatabase()
  let sqlDelete = `DELETE FROM ` + table + ` WHERE forename=?`
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.run(sqlDelete, lookup, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(`Row(s) deleted ${this.changes}`)
        }
      })
      closeDatabase(db)
    })
  })
}
