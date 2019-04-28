var database = require('./database.js')

module.exports = {
  forwardSnippet: forwardSnippet
  // deleteSnippet: deleteSnippet,
  // sendSnippet: sendSnippet
}

// Forwards a snippet on to two separate users.
async function forwardSnippet (snippetid, username) {
  // Select two redirect entries at random.
  // Create two new snippets with the same content id, same first owner, the username of the current user, and an increased forward count.
  // Append the new snippet IDs to the redirects list of owned snippets.
  // Delete the original snippet.
  // Force update the accounts attached to the redirect.

  var snippet = await database.getData('snippet', snippetid)

  var redirectid1 = 0;

  // Need to create two new snippets.
  await database.putSnippetData(snippet.contentid, redirectid1, snippet.firstowner, username, snippet.forwardcount + 1).then( async (res) => {
    console.log("put snippet insert: ", res)

    // Once made, assign to a random user.

  })

  return true
}

async function deleteSnippet (snippetid, accountid) {
  // Retrieve the redirect entry associated with the account ID.
  // Remove the entry for the snippet id from the redirect list of snipped IDs.
  // Remove the snippet entry.
  // Optional: If it's the last snippet then delete the content. This would probably be better done with a garbage collector.
}

async function sendSnippet (snippetInfo, usernamealias) {
  // Select a redirect entry at random, retrieving the redirect ID.
  // Create a new snippet content of snippetInfo, storing the snippet content ID.
  // Create a new snippet with this snippet content id, the redirect ID, same first owner, the username of the current user, and an increased forward count.
}

async function createSnippetContent (content) {
  // Create new snippet content with content.
  // Return the ID of this new snippet content.
}