var database = require('./database.js')

module.exports = {
  forwardSnippet: forwardSnippet
  // deleteSnippet: deleteSnippet,
  // sendSnippet: sendSnippet
}

// Forwards a snippet on to two separate users.
async function forwardSnippet (snippetid, username) {
  var snippet = await database.getData('snippet', snippetid)

  // Select two redirect entries at random.
  // Create two new snippets with the same content id, same first owner, the username of the current user, and an increased forward count.
  // Append the new snippet IDs 

  // Need to create two new snippets.
  await database.putSnippetData(snippet.contentid, snippet.firstowner, username, snippet.forwardcount + 1).then( async (res) => {
    console.log("put snippet insert: ", res)

    // Once made, assign to a random user.

  })

  

  return true
}