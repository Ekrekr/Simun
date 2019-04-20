const http = require('http')
const https = require('https')
const request = require('request')

// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

var userID = 0

function retrieveData (table, id) {
  console.log('Retrieving data from table', table, 'and id', id)
  request('http://localhost:7000/data/' + table + "/" + id, { json: true }, (err, res, body) => {
    if (err) { return console.log(err) }
    return JSON.parse(JSON.stringify(body))
  })
}

// Connect to server to retrieve snippets.
// var snippetList = retrieveTest();
var redirect = retrieveData('redirect', '0')
console.log("Redirect:", redirect)

// Assign snippet data.
var element = $('selected-description').innerHTML = 'New Heading'
