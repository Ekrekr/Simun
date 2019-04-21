const http = require('http')
const https = require('https')
const request = require('request')

console.log("File loaded")

// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

var currentlyActive = 0
var viable = true
counter = 0

while (viable) {
  var itemid = counter
  var item = $(itemid)
  if (item != null) {
    console.log("setting", itemid)
    item.onclick = function() {
      console.log('hello!');
      counter += 1
    }
  }
  else {
    viable = false
  }
}

function test() {
  console.log("setting", position, "active")
}