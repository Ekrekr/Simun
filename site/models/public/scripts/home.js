// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

console.log('Index script started.')

var infoTextList = ['Welcome to Simun!',
  'Simun is a depersonalized image sharing network',
  '"A picture is worth a thousand words"',
  'Images can be sent from the Outbox. When sent, they turn from images to "snippets"',
  'For every image there are multiple snippets with different fates',
  'Creating or forwarding a snippet sends it to two users at random',
  'Deleting a snippet removes it from the system; the image may exist in other snippets though',
  'You can decide the fate of snippets sent to you from your inbox',
  'The most forwarded images are displayed in the global tab for everyone to see',
  'Simun says happy snippeting!']

var infoTextCounter = 0

function updateText () {
  $('info-text').innerHTML = infoTextList[infoTextCounter]
}

function nextText () {
  // Update the text and make left arrow visible as long as as there is a next message.
  if (infoTextCounter < infoTextList.length - 1) {
    infoTextCounter += 1
    updateText()
    $('arrow-left').style.visibility = 'visible'
  }

  // If about to swap to the final message then hide the right arrow.
  if (infoTextCounter === infoTextList.length - 1) {
    $('arrow-right').style.visibility = 'hidden'
  }
}

function prevText () {
  // Update the text and make right arrow visible as long as as there is a previous message.
  if (infoTextCounter > 0) {
    infoTextCounter -= 1
    updateText()
    $('arrow-right').style.visibility = 'visible'
  }

  // Want to hide the left arrow if no more previous messages.
  if (infoTextCounter === 0) {
    $('arrow-left').style.visibility = 'hidden'
  }
}

$('arrow-right').onclick = () => { nextText() }
$('arrow-left').onclick = () => { prevText() }

// Enabling arrow presses using keyboard.
document.addEventListener('keydown', function (event) {
  if (event.keyCode === 37 || event.keyCode === 65) {
    prevText()
  } else if (event.keyCode === 39 || event.keyCode === 68) {
    nextText()
  }
})
