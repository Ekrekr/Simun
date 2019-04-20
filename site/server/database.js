/*****************************************/
/*              DATABASE                 */
/*****************************************/
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

var path = require('path')
const sqlite3 = require('sqlite3').verbose()
const dbPath = path.resolve(__dirname, '../database/database.db')
let sqlGet = `SELECT *
                  FROM Login
                  WHERE username = ?`
let sqlPut = `INSERT INTO Login (forename, surname, username, password) VALUES (?,?,?,?)`
let sqlUpdate = `UPDATE Login SET forename = ? WHERE forename = ?`
let sqlDelete = `DELETE FROM Login WHERE forename=?`

function connectDatabase() {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(err.message)
    }
    console.log('Connected to the Login database.')
  })
}
// close the database connection
function closeDatabase(db) {
  db.close((err) => {
    if (err) {
      return console.error(err.message)
    }
  })
}
// GET
function getData(Table, lookup) {
  let db = connectDatabase()
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.all(sqlGet, lookup, function (err, rows) {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
        closeDatabase(db)
      })
    })
  })
}

// PUT
function putData(Table, forname, surname, username, password) {
  let db = connectDatabase()
  var data = [forname, surname, username, password]
  return new Promise(function (resolve, reject) {
    db.run(sqlPut, data, function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(`Rows inserted ${this.changes}`)
      }
      closeDatabase(db)
    })
  })
}

// UPDATE
function updateData(Table, lookup, change) {
  let db = connectDatabase()
  let data = [change, lookup]
  return new Promise(function (resolve, reject) {
    db.run(sqlUpdate, data, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve(`Row(s) updated: ${this.changes}`)
      }
      closeDatabase(db)
    })
  })
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
      closeDatabase(db)
    })
  })
}