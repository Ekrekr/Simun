const http = require('http')
const https = require('https')
const request = require('request')

// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

// Retrieves data by asking the server for it.
function retrieveData (table, id, _callback) {
  request('http://localhost:7000/data/' + table + "/" + id, { json: true }, (err, res, body) => {
    if (err) { return _callback(err) }
    return _callback(null, JSON.parse(JSON.stringify(body)));
  })
}

// Make a snippet highlighted and fill the selected snippet content with.
function setActive(rowID) {
  console.log("setting", rowID.id, "active")

  // Need to find the child of the current row as its child snippet contains the actual id.
  var contentID = rowID.children[0].id
  console.log("requesting server for", contentID)

  // Need to retrieve the content from the server to populate the selected box.
  retrieveData('snippetcontent', contentID, function(err, content) {
    console.log(content)
    console.log(err)
  })
}

var currentlyActive = 0
var viable = true
counter = 0

// Find all row items and add their onclick listener.
while (viable) {
  var rowID = "select-" + counter
  var rowItem = $(rowID)

  if (rowItem != null) {
    console.log("setting", rowID)

    // Complexity here required to prevent rowItem from always being the final value of the loop.
    rowItem.onclick = ((item) => {
      return () => {
        console.log("hello")
        setActive(item)
      }
    })(rowItem)

    counter += 1
  }
  else {
    viable = false
  }
}