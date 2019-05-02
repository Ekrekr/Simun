var path = require('path')
const sqlite3 = require('sqlite3').verbose()
const dbPath = path.resolve(__dirname, '../database/database.db')
const testsDbPath = path.resolve(__dirname, '../database/tests-database.db')
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {
  getData: getData,
  putUserData: putUserData,
  getUserData: getUserData,
  updateUserData: updateUserData,
  deleteRow: deleteRow,
  hashingEntry: hashingEntry,
  compareHash: compareHash,
  putSnippet: putSnippet,
  updateRedirectSnippetList: updateRedirectSnippetList,
  getRandomRedirect: getRandomRedirect
}

// Connect to the database
function connectDatabase (testMode=false) {
  return new sqlite3.Database(testMode ? testsDbPath : dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error("ERROR while connecting database " + err.message)
    }
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

// Hashes input
async function hashingEntry (entry) {
  return bcrypt.hashSync(entry, saltRounds)
}

// Compares the hash and plaintext of inputs
async function compareHash (plaintext, hash) {
  return bcrypt.compareSync(plaintext, hash)
}

//////////////////////////////////////////////////
// Generalised Wrapper. Not to be made public.
//////////////////////////////////////////////////

// Generic SQL instruction. Returns whatever is returned by the query.
function sqlInstruct(sqlCode, sqlData, testMode=false) {
  let db = connectDatabase(testMode)
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.run(sqlCode, sqlData, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(this.lastID)
        }
      })
      closeDatabase(db)
    })
  })
}

//////////////////////////////////////////////////
// Generalised calls.
//////////////////////////////////////////////////

function getData (table, lookup, testMode=false) {
  var sqlData = [table, lookup]
  var sqlCode = 'SELECT * FROM ? WHERE id = ?'
  return sqlInstruct(sqlCode, sqlData, testMode)
}

//////////////////////////////////////////////////
// Account related calls.
//////////////////////////////////////////////////

// Retrieves a user's login data given their username.
function getUserData (username, testMode=false) {
  var sqlData = [username]
  var sqlSelect = 'SELECT * FROM Login WHERE username = ?'
  return get(sqlSelect, sqlData, testMode)
}

// Creates a new login.
function createUser (username, password, testMode=false) {
  var sqlData = [username, password]
  var sqlInsert = 'INSERT INTO login (username, password) VALUES (?,?)'
  return put(sqlInsert, sqlData)
}

// Updates a users password.
function updateUserPassword (loginid, newPassword) {
  var data = [change, lookup]
  var db = connectDatabase()
  let sqlUpdate = 'UPDATE login SET password = ? WHERE id = ?'
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
  let sqlDelete = 'DELETE FROM ' + table + ' WHERE id=?'
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

//////////////////////////////////////////////////
// Snippet logic calls.
//////////////////////////////////////////////////

function putSnippet (contentid, redirectid, firstOwner, previousOwner, forwardCount) {
  var data = [contentid, redirectid, firstOwner, previousOwner, forwardCount]
  var sqlPut = 'INSERT INTO snippet (contentid, redirectid, firstowner, previousowner, forwardcount) VALUES (?,?,?,?,?)'
  let db = connectDatabase()
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.run(sqlPut, data, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(this.lastID)
        }
      })
      closeDatabase(db)
    })
  })
}

function putSnippetContent (content, description) {
  var data = [content, description]
  var sqlPut = 'INSERT INTO snippetcontent (contentid, description) VALUES (?,?)'
  let db = connectDatabase()
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.run(sqlPut, data, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(this.lastID)
        }
      })
      closeDatabase(db)
    })
  })
}

function updateRedirectSnippetList (redirectid, snippetids) {
  var data = [snippetids, redirectid]
  let sqlUpdate = `UPDATE redirect SET snippetids = ? WHERE id = ?`
  let db = connectDatabase()
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.run(sqlUpdate, data, function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
      closeDatabase(db)
    })
  })
}

function getRandomRedirect () {
  let db = connectDatabase()
  let sqlGet = `SELECT * FROM redirect ORDER BY RANDOM() LIMIT 1;`
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.all(sqlGet, function (err, rows) {
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

// function updateUserData (table, lookup, change) {
//   let data = [change, lookup]
//   let db = connectDatabase()
//   let sqlUpdate = `UPDATE login
//     SET forename = ?
//     WHERE forename = ?`
//   return new Promise(function (resolve, reject) {
//     db.serialize(function () {
//       db.run(sqlUpdate, data, function (err) {
//         if (err) {
//           reject(err)
//         } else {
//           resolve(`Row(s) updated: ${this.changes}`)
//         }
//       })
//       closeDatabase(db)
//     })
//   })
// }