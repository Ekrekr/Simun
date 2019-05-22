var path = require('path')
const sqlite3 = require('sqlite3').verbose()
const dbPath = path.resolve(__dirname, '../database/database.db')
const testsDbPath = path.resolve(__dirname, '../database/tests-database.db')
const bcrypt = require('bcrypt')
var identifiers = require('./identifiers.js')
var moment = require('moment')

// The functions exported here should only allow the transferral of nonsensitive information; login
// details should be strictly monitored, as well as access to redirects.
module.exports = {
  authenticateUser: authenticateUser,
  createUser: createUser,
  updateUserPassword: updateUserPassword,
  removeUser: removeUser,

  createRedirect: createRedirect,
  getRedirect: getRedirect,
  removeRedirect: removeRedirect,
  getUserRedirectID: getUserRedirectID,

  getSnippet: getSnippet,
  removeSnippet: removeSnippet,
  createSnippet: createSnippet,
  forwardSnippet: forwardSnippet,
  addSnippetComment: addSnippetComment,
  getTopTenSnippets: getTopTenSnippets,

  getSnippetContent: getSnippetContent,
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

function hashPassword (password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err)
      else resolve(hash)
    })
  })
}

function comparePassword (password, userData) {
  return new Promise((resolve, reject) => {
    if (userData === undefined) { resolve(false) }
    bcrypt.compare(password, userData.password, (err, isPasswordMatch) => {
      if (err) reject(err)
      resolve(isPasswordMatch)
    })
  })
}

/// ///////////////////////////////////////////////
// Generalised Wrappers. Not to be made public.
/// ///////////////////////////////////////////////

// Generic SQL instruction that returns whatever is returned by the query.
function sqlGet (sqlCode, lookup, testMode = false) {
  let db = connectDatabase(testMode)
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(sqlCode, lookup, (err, result) => {
        return err ? reject(err) : resolve(result)
      })
      closeDatabase(db)
    })
  })
}

// Generic SQL instruction that returns whatever the new ID inserted is.
async function sqlPut (sqlCode, sqlData, testMode = false) {
  var db = connectDatabase(testMode)
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(sqlCode, sqlData, function (err, result) {
        if (err) {
          if (err.errno === 19) {
            resolve(identifiers.duplicateID)
          }
          reject(err)
        }
        resolve(this.lastID)
      })
      closeDatabase(db)
    })
  })
}

// Returns a random entry from the table specified.
async function sqlGetRandom (table, testMode = false) {
  var sqlCode = 'SELECT * FROM ' + table + ' ORDER BY RANDOM() LIMIT 1'
  var db = connectDatabase(testMode)
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(sqlCode, (err, result) => {
        return err ? reject(err) : resolve(result)
      })
      closeDatabase(db)
    })
  })
}

/// ///////////////////////////////////////////////
// Account Related Calls.
/// ///////////////////////////////////////////////

async function authenticateUser (username, password, testMode = false) {
  var sqlCode = 'SELECT * FROM Login WHERE username = ?'
  var userData = await sqlGet(sqlCode, username, testMode).then(res => { return res[0] })
  return comparePassword(password, userData)
}

async function createUser (username, password, redirectid, testMode = false) {
  // Salt and hash the password.
  var securePassword = await hashPassword(password)

  // Insert the account details into the database.
  var sqlData = [username, securePassword, redirectid]
  var sqlCode = 'INSERT INTO login (username, password, redirectid) VALUES (?, ?, ?)'

  return sqlPut(sqlCode, sqlData, testMode)
}

async function updateUserPassword (loginid, newPassword, testMode = false) {
  // Salt and hash the password.
  var securePassword = await hashPassword(newPassword)

  var sqlData = [securePassword, loginid]
  var sqlCode = 'UPDATE login SET password = ? WHERE id = ?'
  return sqlPut(sqlCode, sqlData, testMode)
}

function removeUser (loginid, testMode = false) {
  var sqlData = [loginid]
  var sqlCode = 'DELETE FROM login WHERE id = ?'
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

async function getUserRedirectID (username, testMode = false) {
  var sqlCode = 'SELECT * FROM Login WHERE username = ?'
  var userData = await sqlGet(sqlCode, username, testMode).then(res => { return res[0] })
  var fromRedirect = await getRedirect(userData.redirectid, testMode).then(res => { return res[0] })
  return fromRedirect.id
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

  // Create a new snippet content.
  var sqlCode = 'INSERT INTO snippetcontent (content, description) VALUES (?, ?)'
  var snippetContentID = await sqlPut(sqlCode, [content, description], testMode).then(res => { return res })

  // Create a new snippet with the content, belonging to the fromRedirect and from the fromRedirect.
  var sqlData = [snippetContentID, fromRedirect.id, fromRedirect.alias, fromRedirect.alias, 0, '[]']
  sqlCode = 'INSERT INTO snippet (contentid, redirectid, firstowner, previousowner, forwardcount, comments) VALUES (?, ?, ?, ?, ?, ?)'
  var snippetID = await sqlPut(sqlCode, sqlData, testMode).then(res => { return res })

  // Append the snippet ID to the redirects list of owned redirect IDs.
  var snippetList = JSON.parse(fromRedirect.snippetids)
  snippetList.push(snippetID.toString())
  snippetList = JSON.stringify(snippetList)
  await updateRedirectSnippetList(fromRedirect.id, snippetList, testMode).then(res => { return res })

  var snippetIDs = await forwardSnippet(snippetID, testMode)

  return snippetIDs
}

async function forwardSnippet (snippetid, testMode = false) {
  // Retrieve the current snippet.
  var currentSnippet = await getSnippet(snippetid, testMode).then(res => { return res[0] })

  // Retrieve the redirect corresponding to the redirectid.
  var fromRedirect = await getRedirect(currentSnippet.redirectid, testMode).then(res => { return res[0] })

  // Retrieve the redirect of two random users.
  var toRedirect0 = await sqlGetRandom('redirect', testMode).then(res => { return res[0] })
  var toRedirect1 = await sqlGetRandom('redirect', testMode).then(res => { return res[0] })

  // Create two new snippets with the same content, belonging to the two different
  // toRedirects and from the fromRedirect.
  var sqlCode = 'INSERT INTO snippet (contentid, redirectid, firstowner, previousowner, forwardcount, comments) VALUES (?, ?, ?, ?, ?, ?)'
  var sqlData = [currentSnippet.contentid, toRedirect0.id, currentSnippet.firstowner, fromRedirect.alias, currentSnippet.forwardcount + 1, currentSnippet.comments]
  var newSnippetID0 = await sqlPut(sqlCode, sqlData, testMode).then(res => { return res })
  sqlData = [currentSnippet.contentid, toRedirect1.id, currentSnippet.firstowner, fromRedirect.alias, currentSnippet.forwardcount + 1]
  var newSnippetID1 = await sqlPut(sqlCode, sqlData, testMode).then(res => { return res })

  // Append the snippet ID to each of the toRedirects list of snippet IDs.
  var snippetList = JSON.parse(toRedirect0.snippetids)
  snippetList.push(newSnippetID0.toString())
  snippetList = JSON.stringify(snippetList)
  await updateRedirectSnippetList(toRedirect0.id, snippetList, testMode).then(res => { return res })

  snippetList = JSON.parse(toRedirect1.snippetids)
  snippetList.push(newSnippetID1.toString())
  snippetList = JSON.stringify(snippetList)
  await updateRedirectSnippetList(toRedirect1.id, snippetList, testMode).then(res => { return res })

  // Remove the snippet ID in the original redirects list of snippet IDs.
  snippetList = JSON.parse(fromRedirect.snippetids)
  snippetList.splice(snippetList.indexOf(currentSnippet.id.toString()), 1)
  snippetList = JSON.stringify(snippetList)
  await updateRedirectSnippetList(fromRedirect.id, snippetList, testMode).then(res => { return res })

  // Remove the original snippet
  await removeSnippet(currentSnippet.id, testMode).then(res => { return res })

  return [newSnippetID0, newSnippetID1]
}

async function addSnippetComment (snippetid, alias, comment, testMode = false) {
  // Retrieve the desired snippet.
  var currentSnippet = await getSnippet(snippetid, testMode).then(res => { return res[0] })

  // Decode existing list.
  var commentList = JSON.parse(currentSnippet.comments)

  // Form a new comment and push it to the comment list.
  var timestamp = moment().toISOString()
  var newComment = { alias: alias, timestamp: timestamp, comment: comment }
  commentList.push(newComment)

  // Serialize the comments list, update the snippet comments.
  commentList = JSON.stringify(commentList)
  var sqlData = [commentList, snippetid]
  var sqlCode = 'UPDATE snippet SET comments = ? WHERE id = ?'
  return sqlPut(sqlCode, sqlData, testMode)
}

function getTopTenSnippets (testMode = false) {
  var sqlCode = 'SELECT * FROM snippet ORDER BY forwardcount DESC LIMIT 10'
  let db = connectDatabase(testMode)
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(sqlCode, (err, result) => {
        return err ? reject(err) : resolve(result)
      })
      closeDatabase(db)
    })
  })
}

/// ///////////////////////////////////////////////
// Snippet Content Related Calls.
/// ///////////////////////////////////////////////

function getSnippetContent (snippetcontentid, testMode = false) {
  var sqlCode = 'SELECT * FROM snippetcontent WHERE id = ?'
  return sqlGet(sqlCode, snippetcontentid, testMode)
}

function removeSnippetContent (snippetcontentid, testMode = false) {
  var sqlData = [snippetcontentid]
  var sqlCode = 'DELETE FROM snippetcontent WHERE id = ?'
  return sqlPut(sqlCode, sqlData, testMode)
}