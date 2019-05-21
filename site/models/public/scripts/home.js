// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

console.log('Index script started.')

var infoTextList = ['Welcome to Simun!',
  'Simun is the first fully depersonalized social network',
  'You can send and receive these things we call "snippets"',
  'Snippets are little nuggets of whatever you want',
  'They can be funny, eye opening or educational; you pick',
  'The catch is, you can\'t decide who you send to or receive from',
  'Snippets are transferred completely at random',
  'Here, try sending a snippet',
  'Great, now see if you have received any back',
  'And that\'s how the system goes!']

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
