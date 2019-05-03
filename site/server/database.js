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
  getRedirect: getRedirect,
  removeRedirect: removeRedirect,

  getSnippet: getSnippet,
  removeSnippet: removeSnippet,
  createSnippet: createSnippet,
  forwardSnippet: forwardSnippet,

  removeSnippetContent: removeSnippetContent
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

// Returns a random entry from the table specified.
function sqlGetRandom (table, testMode = false) {
  sqlCode = 'SELECT * FROM ' + table + ' ORDER BY RANDOM() LIMIT 1'
  let db = connectDatabase(testMode)
  return new Promise(function (resolve, reject) {
    db.serialize(function () {
      db.all(sqlCode, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
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
  return sqlGet(sqlCode, redirectid, testMode)
}

function updateRedirectSnippetList (redirectid, snippetids, testMode = false) {
  var sqlData = [snippetids, redirectid]
  var sqlCode = 'UPDATE redirect SET snippetids = ? WHERE id = ?'
  return sqlPut(sqlCode, sqlData, testMode)
}

function removeRedirect (redirectid, testMode = false) {
  var sqlData = [redirectid]
  var sqlCode = 'DELETE FROM redirect WHERE id = ?'
  return sqlPut(sqlCode, sqlData, testMode)
}

/// ///////////////////////////////////////////////
// Snippet Related Calls.
/// ///////////////////////////////////////////////

function getSnippet (snippetid, testMode = false) {
  var sqlCode = 'SELECT * FROM snippet WHERE id = ?'
  return sqlGet(sqlCode, snippetid, testMode)
}

function removeSnippet (snippetid, testMode = false) {
  var sqlData = [snippetid]
  var sqlCode = 'DELETE FROM snippet WHERE id = ?'
  return sqlPut(sqlCode, sqlData, testMode)
}

async function createSnippet (content, description, redirectid, testMode = false) {
  // Retrieve the redirect corresponding to the redirectid.
  var fromRedirect = await getRedirect(redirectid, testMode).then(res => { return res[0] })

  // Retrieve the redirect of a random user.
  toRedirect = await sqlGetRandom('redirect', testMode).then(res => { return res[0] })

  // Create a new snippet content.
  sqlCode = 'INSERT INTO snippetcontent (content, description) VALUES (?, ?)'
  snippetContentID = await sqlPut(sqlCode, [content, description], testMode).then(res => { return res })

  // Create a new snippet with the content, belonging to the toRedirect and from the fromRedirect.
  var sqlData = [snippetContentID, toRedirect.id, fromRedirect.alias, fromRedirect.alias, 0]
  sqlCode = 'INSERT INTO snippet (contentid, redirectid, firstowner, previousowner, forwardcount) VALUES (?, ?, ?, ?, ?)'
  snippetID = await sqlPut(sqlCode, sqlData, testMode).then(res => { return res })

  // Append the snippet ID to the redirects list of owned redirect IDs.
  var snippetList = JSON.parse(toRedirect.snippetids)
  snippetList.push(snippetID.toString())
  snippetList = JSON.stringify(snippetList)
  var redirected = await updateRedirectSnippetList(toRedirect.id, snippetList, testMode).then(res => { return res })

  return snippetID
}

function forwardSnippet (snippetid, testMode = false) {
  // Retrieve the redirect corresponding to the redirectid.
  var fromRedirect = await getRedirect(redirectid, testMode).then(res => { return res[0] })

  // Retrieve the redirect of two random users.
  toRedirect0 = await sqlGetRandom('redirect', testMode).then(res => { return res[0] })
  toRedirect1 = await sqlGetRandom('redirect', testMode).then(res => { return res[0] })

  // Create two new snippets with the same content, belonging to the two different 
  // toRedirects and from the fromRedirect.
  sqlCode = 'INSERT INTO snippet (contentid, redirectid, firstowner, previousowner, forwardcount) VALUES (?, ?, ?, ?, ?)'
  var sqlData = [snippetContentID, toRedirect.id, fromRedirect.alias, fromRedirect.alias, 0]
  
  snippetID = await sqlPut(sqlCode, sqlData, testMode).then(res => { return res })

}

/// ///////////////////////////////////////////////
// Snippet Content Related Calls.
/// ///////////////////////////////////////////////

async function removeSnippetContent (snippetcontentid, testMode = false) {
  var sqlData = [snippetcontentid]
  var sqlCode = 'DELETE FROM snippetcontent WHERE id = ?'
  return sqlPut(sqlCode, sqlData, testMode)
}
