var path = require('path')
const sqlite3 = require('sqlite3').verbose()
const dbPath = path.resolve(__dirname, '../database/database.db')
const testsDbPath = path.resolve(__dirname, '../database/tests-database.db')
const bcrypt = require('bcrypt')
const saltRounds = 10

// The functions exported here should only allow the transferral of nonsensitive information; login
// details should be strictly monitored, as well as access to redirects.
// TODO: Ensure this happens.
module.exports = {
  hashEntry: hashEntry,
  compareHash: compareHash,

  getData: getData,

  createUser: createUser,
  getUserData: getUserData,
  updateUserPassword: updateUserPassword,
  removeUser: removeUser,

  createRedirect: createRedirect,
  updateRedirectSnippetList: updateRedirectSnippetList,
  getRedirect: getRedirect,
  getRandomRedirect: getRandomRedirect,
  removeRedirect: removeRedirect,

  createSnippet: createSnippet,

  createSnippetContent: createSnippetContent
}

// Connect to the database
function connectDatabase (testMode = false) {
  return new sqlite3.Database(testMode ? testsDbPath : dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error('ERROR while connecting database ' + err.message)
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
async function hashEntry (entry) {
  return bcrypt.hashSync(entry, saltRounds)
}

// Compares the hash and plaintext of inputs.
async function compareHash (plaintext, hash) {
  return bcrypt.compareSync(plaintext, hash)
}

/// ///////////////////////////////////////////////
// Generalised Wrappers. Not to be made public.
/// ///////////////////////////////////////////////

// Generic SQL instruction that returns whatever is returned by the query.
function sqlGet (sqlCode, lookup, testMode = false) {
  let db = connectDatabase(testMode)
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.all(sqlCode, lookup, function (err, result) {
        if (err) {
          reject(err)
        } else {
          console.log('result found:', result)
          resolve(result)
        }
      })
      closeDatabase(db)
    })
  })
}

// Generic SQL instruction that returns whatever the new ID inserted is.
function sqlPut (sqlCode, sqlData, testMode = false) {
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

/// ///////////////////////////////////////////////
// Generalised Calls.
/// ///////////////////////////////////////////////

// TODO: Phase this out, insecure.
function getData (table, lookup, testMode = false) {
  var sqlData = [table, lookup]
  var sqlCode = 'SELECT * FROM ? WHERE id = ?'
  return sqlGet(sqlCode, sqlData, testMode)
}

/// ///////////////////////////////////////////////
// Login Related Calls.
/// ///////////////////////////////////////////////

// Retrieves a user's login data given their username.
// TODO: Remove this and compare hashes directly without returning full user data.
function getUserData (username, testMode = false) {
  var sqlCode = 'SELECT * FROM Login WHERE username = ?'
  return sqlGet(sqlCode, username, testMode)
}

function createUser (username, password, redirectid, testMode = false) {
  var sqlData = [username, password, redirectid]
  var sqlCode = 'INSERT INTO login (username, password, redirectid) VALUES (?, ?, ?)'
  return sqlPut(sqlCode, sqlData, testMode)
}

function updateUserPassword (loginid, newPassword, testMode = false) {
  var sqlData = [newPassword, loginid]
  let sqlCode = 'UPDATE login SET password = ? WHERE id = ?'
  return sqlPut(sqlCode, sqlData, testMode)
}

function removeUser (loginid, testMode = false) {
  var sqlData = [loginid]
  let sqlCode = 'DELETE FROM login WHERE id = ?'
  return sqlPut(sqlCode, sqlData, testMode)
}

/// ///////////////////////////////////////////////
// Redirect Related Calls.
/// ///////////////////////////////////////////////

function createRedirect (alias, roleid, testMode = false) {
  var sqlData = [alias, '[]', roleid]
  var sqlCode = 'INSERT INTO redirect (alias, snippetids, roleid) VALUES (?, ?, ?)'
  return sqlPut(sqlCode, sqlData, testMode)
}

function getRedirect (redirectid, testMode = false) {
  var sqlCode = 'SELECT * FROM redirect WHERE id = ?'
  console.log('Performing sql code:', sqlCode, ' on lookup', redirectid)
  return sqlGet(sqlCode, redirectid, testMode)
}

function updateRedirectSnippetList (redirectid, snippetids) {
  var sqlData = [snippetids, redirectid]
  let sqlCode = 'UPDATE redirect SET snippetids = ? WHERE id = ?'
  return sqlPut(sqlCode, sqlData, testMode)
}

function getRandomRedirect () {
  let sqlCode = 'SELECT * FROM redirect ORDER BY RANDOM() LIMIT 1'
  return sqlGet(sqlCode, null, testMode)
}

function removeRedirect (redirectid, testMode = false) {
  var sqlData = [redirectid]
  let sqlCode = 'DELETE FROM redirect WHERE id = ?'
  return sqlPut(sqlCode, sqlData, testMode)
}

/// ///////////////////////////////////////////////
// Snippet Related Calls.
/// ///////////////////////////////////////////////

function createSnippet (contentid, redirectid, firstOwner, previousOwner, forwardCount, testMode = false) {
  var sqlData = [contentid, redirectid, firstOwner, previousOwner, forwardCount]
  var sqlCode = 'INSERT INTO snippet (contentid, redirectid, firstowner, previousowner, forwardcount) VALUES (?, ?, ?, ?, ?)'
  return sqlPut(sqlCode, sqlData, testMode)
}

/// ///////////////////////////////////////////////
// Snippetcontent Related Calls.
/// ///////////////////////////////////////////////

function createSnippetContent (content, description, testMode) {
  var sqlData = [content, description]
  var sqlCode = 'INSERT INTO snippetcontent (contentid, description) VALUES (?, ?)'
  return sqlPut(sqlCode, sqlData, testMode)
}
