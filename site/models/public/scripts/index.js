var tools = require('./tools.js')

var currentlyActive = 0

// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

console.log("Index script started.")

var arrowLeft = $('arrow-left')
var arrowRight = $('arrow-right')

$('arrow-right').onclick = () => {
  console.log('Right arrow pressed')
}

$('arrow-left').onclick = () => {
  console.log('Left arrow pressed')
}