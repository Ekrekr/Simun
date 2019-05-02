var path = require('path')
const sqlite3 = require('sqlite3').verbose()
const dbPath = path.resolve(__dirname, '../database/database.db')
const testsDbPath = path.resolve(__dirname, '../database/tests-database.db')
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {
  getData: getData,
  createUser: createUser,
  getUserData: getUserData,
  updateUserPassword: updateUserPassword,
  createRedirect: createRedirect,
  deleteRow: deleteRow,
  hashingEntry: hashingEntry,
  compareHash: compareHash,
  createSnippet: createSnippet,
  createSnippetContent: createSnippetContent,
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

// Close the database connection.
function closeDatabase (db) {
  db.close((err) => {
    if (err) {
      return console.error(err.message)
    }
  })
}

// Hashes given input.
async function hashingEntry (entry) {
  return bcrypt.hashSync(entry, saltRounds)
}

// Compares the hash and plaintext of inputs.
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
// Account related.
//////////////////////////////////////////////////

// Retrieves a user's login data given their username.
// TODO: Remove this and compare hashes directly without returning full user data.
function getUserData (username, testMode=false) {
  var sqlData = [username]
  var sqlCode = 'SELECT * FROM Login WHERE username = ?'
  return sqlInstruct(sqlCode, sqlData, testMode)
}

// Creates a new login.
function createUser (username, password, testMode=false) {
  var sqlData = [username, password]
  var sqlCode = 'INSERT INTO login (username, password) VALUES (?, ?)'
  return sqlInstruct(sqlCode, sqlData, testMode)
}

// Updates a users password.
function updateUserPassword (loginid, newPassword, testMode=false) {
  var sqlData = [newPassword, loginid]
  let sqlCode = 'UPDATE login SET password = ? WHERE id = ?'
  return sqlInstruct(sqlCode, sqlData, testMode)
}

// Removes a user's login details from the database.
function removerUser (loginid) {
  var sqlData = [loginid]
  let sqlCode = 'DELETE FROM login WHERE id = ?'
  return sqlInstruct(sqlCode, sqlData, testMode)
}

// Creates a new redirect.
function createRedirect (alias, roleid, testMode=false) {
  var sqlData = [alias, [], roleid]
  var sqlCode = 'INSERT INTO redirect (alias, snippetids, roleid) VALUES (?, ?, ?)'
  return sqlInstruct(sqlCode, sqlData, testMode)
}

//////////////////////////////////////////////////
// Snippet logic.
//////////////////////////////////////////////////

function createSnippet (contentid, redirectid, firstOwner, previousOwner, forwardCount, testMode=false) {
  var sqlData = [contentid, redirectid, firstOwner, previousOwner, forwardCount]
  var sqlCode = 'INSERT INTO snippet (contentid, redirectid, firstowner, previousowner, forwardcount) VALUES (?, ?, ?, ?, ?)'
  return sqlInstruct(sqlCode, sqlData, testMode)
}

function createSnippetContent (content, description, testMode) {
  var sqlData = [content, description]
  var sqlCode = 'INSERT INTO snippetcontent (contentid, description) VALUES (?, ?)'
  return sqlInstruct(sqlCode, sqlData, testMode)
}

function updateRedirectSnippetList (redirectid, snippetids) {
  var sqlData = [snippetids, redirectid]
  let sqlCode = 'UPDATE redirect SET snippetids = ? WHERE id = ?'
  return sqlInstruct(sqlCode, sqlData, testMode)
}

function getRandomRedirect () {
  let sqlCode = 'SELECT * FROM redirect ORDER BY RANDOM() LIMIT 1'
  return sqlInstruct(sqlCode, [], testMode)
}
