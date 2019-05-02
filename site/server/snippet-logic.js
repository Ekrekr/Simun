var database = require('./database.js')

module.exports = {
  forwardSnippet: forwardSnippet,
  createSnippet: createSnippet
  // deleteSnippet: deleteSnippet,
  // sendSnippet: sendSnippet
}

// Forwards a snippet on to two separate users at random.
async function forwardSnippet (snippetid, redirectid) {
  console.log("snippet-logic: forwarding snippet from account " + redirectid)

  // Retrieve redirect for the current user.
  let fromRedirect = await database.getData('redirect', redirectid).then(res => {return res[0]})

  // Select two redirect entries at random.
  let toRedirect1 = await database.getRandomRedirect().then(res => {return res[0]})
  let toRedirect2 = await database.getRandomRedirect().then(res => {return res[0]})
  console.log("Redirects chosen with IDs: " + toRedirect1.id + " and " + toRedirect2.id)

  // Create two new snippets with the same content id, same first owner, the alias of the current user, and an increased forward count.
  let snippet = await database.getData('snippet', snippetid).then(res => {return res[0]})
  console.log("snippet found with ID: " + snippet.id)
  let newSnippetID1 = await database.putSnippet(snippet.contentid, toRedirect1.id, snippet.firstowner, fromRedirect.alias, snippet.forwardcount + 1).then( res => {return res})
  let newSnippetID2 = await database.putSnippet(snippet.contentid, toRedirect2.id, snippet.firstowner, fromRedirect.alias, snippet.forwardcount + 1).then( res => {return res})
  console.log("New snippets: " + newSnippetID1 + ", " + newSnippetID2)

  // Append the new snippet IDs to the redirects list of owned snippets.
  var snippetList = JSON.parse(toRedirect1.snippetids)
  snippetList.push(newSnippetID1.toString())
  await database.updateRedirectSnippetList(snippetList, toRedirect1.id).then(res => {})
  var snippetList = JSON.parse(toRedirect1.snippetids)
  snippetList.push(newSnippetID2.toString())
  await database.updateRedirectSnippetList(snippetList, toRedirect2.id).then(res => {})

  // Delete the original snippet.
  // await database.deleteRow('snippet', snippetid).then(res => {})

  // Delete the snippet from the senders' redirect.
  var snippetList = JSON.parse(fromRedirect.snippetids)
  snippetList.splice(snippetList.indexOf(snippetid.toString()), 1);
  await database.updateRedirectSnippetList(snippetList, fromRedirect.id).then(res => {})

  // Force update the accounts attached to the redirect.
  // TODO

  return true
}

// Creates new content, encapsulats it in a snippet, and then forwards the snippet.
async function createSnippet (content, description, redirectid) {
  // Create a new snippet content of snippetInfo, storing the snippet content ID.
  let newSnippetContentID = await database.putSnippetContent(content, description).then(res => {return res})

  // Retrieve the current username alias.
  let fromRedirect = await database.getData('redirect', redirectid).then(res => {return res[0]})

  // Create a 'fake' snippet that belongs to the current user.
  let newSnippetID = await database.putSnippet(newSnippetContentID, fromRedirect.id, fromRedirect.alias, fromRedirect.alias, 0).then( res => {return res})

  // Forward the snippet on.
  let forwarded = await forwardSnippet(newSnippetID)

  return true
}

async function deleteSnippet (snippetid, accountid) {
  // Retrieve the redirect entry associated with the account ID.
  // Remove the entry for the snippet id from the redirect list of snipped IDs.
  // Remove the snippet entry.
  // Optional: If it's the last snippet then delete the content. This would probably be better done with a garbage collector.
}

async function createSnippetContent (content) {
  // Create new snippet content with content.
  // Return the ID of this new snippet content.
}