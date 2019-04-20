const http = require('http')
const https = require('https')
const request = require('request')

// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

var userID = 0

// Retrieves data by asking the server for it.
function retrieveData (table, id, _callback) {
  request('http://localhost:7000/data/' + table + "/" + id, { json: true }, (err, res, body) => {
    if (err) { return _callback(err) }
    return _callback(null, JSON.parse(JSON.stringify(body)));
  })
}

usersnippets = []

// First retrieve the redirect on which snippets the user currently has.
retrieveData('redirect', 0, function(err, redirect) {
  var snippets = JSON.parse(redirect.snippetids)

  // For each snippet, retrieve the snippet content ID.
  snippets.forEach(function(entry, index) {
    retrieveData('snippets', entry, function(err, snippet) {

      // Retrieve the snippet content
      retrieveData('snippetcontent', snippet.contentid, function(err, snippetcontent) {

        // Want to populate the main content with the first snippet by default.
        if (index == 0) {
          $('selected-description').innerHTML = snippetcontent.description
          $('selected-content').src = snippetcontent.content
        }

        // Push all snippets to an array 
        usersnippets.push({})
      })
    })
  })
})

// Assign snippet data.
