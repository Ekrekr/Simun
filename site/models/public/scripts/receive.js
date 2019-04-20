const http = require('http')
const https = require('https')
const request = require('request')

// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

var userID = 0

function retrieveData (table, id, _callback) {
  request('http://localhost:7000/data/' + table + "/" + id, { json: true }, (err, res, body) => {
    if (err) { return _callback(err) }
    return _callback(null, JSON.parse(JSON.stringify(body)));
  })
}

// First retrieve the redirect on which snippets the user currently has
retrieveData('redirect', 0, function(err, redirect) {
  var snippets = JSON.parse(redirect.snippetids)

  // For each snippet, retrieve the snippet ID
  snippets.forEach(function(entry) {
    retrieveData('snippets', entry, function(err, snippet) {

      // Retrieve the snippet content ID
      retrieveData('snippetcontent', snippet.contentid, function(err, snippetcontent) {
        console.log("snippet content:", snippetcontent.content)
      })
    })
  })
})

// Assign snippet data.
var element = $('selected-description').innerHTML = 'New Heading'
