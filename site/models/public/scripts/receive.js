const http = require('http')
const https = require('https')
const request = require('request')

// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

function retrieveSnippetsList (userID) {
  var snippetList = ''
  console.log('Retrieving snippets')
  request('http://localhost:7000/snippet-list/0', { json: true }, (err, res, body) => {
    if (err) { return console.log(err) }
    console.log('Error:', err)
    console.log('Result:', res)
    console.log('Body:', body)
  })
}

// Connect to server to retrieve snippets.
// var snippetList = retrieveTest();
var snippetList = retrieveSnippetsList(0)

// Assign snippet data.
var element = $('selected-description').innerHTML = 'New Heading'
