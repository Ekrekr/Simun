var path = require('path')
const sqlite3 = require('sqlite3').verbose()
const dbPath = path.resolve(__dirname, '../database/database.db')
const bcrypt = require("bcrypt")
const saltRounds = 10

//Export
module.exports = {
  connectDatabase: function connectDatabase() {},
  putData: putData,
  getData: getData,
  getUserData: getUserData,
  updateData: updateData,
  deleteRow: deleteRow,
  hashingEntry: hashingEntry,
  compareHash: compareHash
}

//Hashes input
async function hashingEntry(entry) {
  return await bcrypt.hashSync(entry, saltRounds);
}

//Compares the hash and plaintext of inputs
async function compareHash(plaintext, hash) {
  return await bcrypt.compareSync(plaintext, hash);
}

//Connect to the database
function connectDatabase() {
  return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message)
    }
    console.log('Connected to the Login database.')
  })
}

//Close the database connection
function closeDatabase(db) {
  db.close((err) => {
    if (err) {
      return console.error(err.message)
    }
  })
}

// GET data from database
function getData(table, lookup) {
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
      db.close()
    })
  })
}

function getUserData(table, lookup) {
  let db = connectDatabase()
  let sqlGet = `SELECT *
                  FROM ` + table + `
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
      db.close()
    })
  })
}

// PUT data from database
function putData(table, forname, surname, username, password) {
  var data = [forname, surname, username, password]
  var sqlPut = `INSERT INTO ` + table + ` (forename, surname, username, password) VALUES (?,?,?,?)`
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
      db.close()
    })
  })
}

// UPDATE data from database
function updateData(table, lookup, change) {
  let data = [change, lookup]
  let db = connectDatabase()
  let sqlUpdate = `UPDATE ` + table +
    `SET forename = ?
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
      db.close()
    })
  })
}

// DELETE data from database
function deleteRow(table, lookup) {
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
      db.close()
    })
  })
}