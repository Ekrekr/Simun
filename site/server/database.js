const sqlite3 = require('sqlite3').verbose()
var path = require('path')
const dbPath = path.resolve(__dirname, '../database/database.db')

// Export functions
module.exports = {
  connectDatabase: connectDatabase,
  putData: putData,
  getData: getData,
  updateData: updateData,
  deleteRow: deleteRow
}

function connectDatabase () {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(err.message)
    }
    console.log('Connected to the Login database.')
  })
}

// GET
function getData (db, table, lookup) {
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.all(`SELECT *
                  FROM ` + table + `
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
function putData (db, table, forname, surname, username, password) {
  var data = [forname, surname, username, password]
  var sqlPut = `INSERT INTO ` + table + ` (forename, surname, username, password) VALUES (?,?,?,?)`
  return new Promise(function (resolve, reject) {
    db.run(sqlPut, data, function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(`Rows inserted ${this.changes}`)
      }
    })
  })
}

// UPDATE
function updateData (db, table, lookup, change) {
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
function deleteRow (db, table, lookup) {
  return new Promise(function (resolve, reject) {
    db.run(`DELETE FROM ` + table + ` WHERE forename=?`, lookup, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve(`Row(s) deleted ${this.changes}`)
      }
    })
  })
}
