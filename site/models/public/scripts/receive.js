var tools = require('./tools.js')

var currentlyActive = 0

// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

// Make a snippet highlighted and fill the selected snippet content with.
function setActive (counter) {
  var rowItem = $('select-' + counter)

  // Need to find the child of the current row as its child snippet contains the actual id.
  var contentID = rowItem.children[0].id

  // Need to retrieve the content from the server to populate the selected box.
  tools.retrieveSnippetContent(contentID, (err, snippet) => {
    if (err) {
      console.log('Error retrieving snippetcontent from server:', err)
      return
    }
    $('selected-content').src = snippet.content
    $('selected-description').innerHTML = snippet.description

    // Update trash it and forward it buttons.
    $('forward-it').onclick = () => {
      console.log('trash-it button pressed')
      tools.forwardSnippet(snippet.id, (err, response) => {
        if (err) {
          console.log('Error forwarding snippet', err)
          return
        }
        console.log('Snippet successfully forwarded')
      })
    }
  })

  // Unhighlight the current selector and highlight the selected
  var prevRowItem = $('select-' + currentlyActive)
  prevRowItem.children[0].style.backgroundColor = tools.colorprimary
  currentlyActive = counter
  rowItem.children[0].style.backgroundColor = tools.colorlight
}

// Finds all row items and adds their onclick listener.
function assignButtons () {
  var viable = true
  var counter = 0
  while (viable) {
    var rowID = 'select-' + counter
    var rowItem = $(rowID)

    if (rowItem != null) {
      // Complexity here required to prevent rowItem from always being the final value of the loop.
      rowItem.onclick = ((item) => {
        return () => {
          setActive(item)
        }
      })(counter)

      counter += 1
    } else {
      viable = false
    }
  }
}

assignButtons()

setActive(0)
