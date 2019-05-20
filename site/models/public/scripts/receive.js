var tools = require('./tools.js')

var currentlyActive = 0

// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

// Open the snippet selector bar on the left.
function openSelect () {
  // $("sidenav").style.width = "250px"
  $('expand-icon').onclick = () => { closeSelect() }
  $('expand-icon-visual').style.transform = 'rotate(180deg)'
  $('snippet-list').style.left = '0px'
  $('snippet-list-background').style.left = '0px'
}

// Close the snippet selector bar.
function closeSelect () {
  $('expand-icon').onclick = () => { openSelect() }
  $('expand-icon-visual').style.transform = ''
  $('snippet-list').style.left = '-288px'
  $('snippet-list-background').style.left = '-288px'
}

// Make a snippet highlighted and fill the selected snippet content with.
async function setActive (counter) {
  var rowItem = $('select-' + counter)

  // Need to find the child of the current row as its child snippet contains the snippet id.
  var snippetID = rowItem.children[0].id

  // Retrieve the actual snippet, then use that value to retrieve the snippet content.
  var snippet = await tools.retrieveSnippet(snippetID).then(res => { return res })
  var snippetContent = await tools.retrieveSnippetContent(snippet.contentid).then(res => { return res })
  $('selected-content').src = snippetContent.content
  $('selected-description').innerHTML = snippetContent.description

  var comments = tools.standardise(snippet.comments)
  console.log('comments:', comments)

  // Update trash it and forward it buttons to respond for this snippet in particular.
  $('forward-it').onclick = () => {
    console.log('trash-it button pressed')
    tools.forwardSnippet(snippetID, (err, response) => {
      if (err) {
        console.log('Error forwarding snippet', err)
        return
      }
      console.log('Snippet successfully forwarded, response:', response)
    })
  }

  // snippet = await tools.retrieveSnippet(contentID)

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

// If no snippets then place bin.
if ($('select-0') !== null) {
  assignButtons()
  setActive(0)
} else {
  $('selected-content').src = 'https://i.imgur.com/DccRRP7.jpg'
  // $('selected-description').innerHTML = 'Example description'
  // $('selected-author').innerHTML = 'Example author'
}

$('expand-icon').onclick = () => { openSelect() }
