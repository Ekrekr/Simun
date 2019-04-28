var database = require('./database.js')

module.exports = {
  forwardSnippet: forwardSnippet,
  deleteSnippet: deleteSnippet,
  sendSnippet: sendSnippet
}

// Forwards a snippet on to two separate users.
async function forwardSnippet(snippetid) {
  database.getUserData('snippets', snippetid).then( result => {
    console.log(result)
  })
}