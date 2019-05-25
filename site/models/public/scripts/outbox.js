var tools = require('./tools.js')

// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

var titleField = $('snippet-title')
var fileField = $('snippet-file')
var fileBackground = $('snippet-file-container')
var sendButton = $('send-button')

// When someone uploads a file, select the file being uploaded.
fileField.addEventListener('change', (e) => {
  // The multiple field is not allowed, so the file will always be at the 0th index.
  var selectedFile = fileField.files[0]

  // Once the file has loaded, read it in as an url in order to display.
  var reader = new window.FileReader()
  reader.readAsDataURL(selectedFile)
  reader.onload = (e) => {
    fileBackground.style.backgroundImage = 'url(' + e.target.result + ')'

    // Retreive the image dimensions then scale the upload box background from there.
    var img = new window.Image()
    img.src = reader.result
    img.onload = () => {
      // No resize if mobile version.
      var maxWidth = window.matchMedia("(min-width: 600px)") ? 400 : 300;
      // If the image is wider than it is tall, then to maximise the area occupied set the width
      // to the width of the divider and the height to the maxium height while keeping the
      // correct aspect ratio. Do the opposite if the image is taller than it is wide.
      if (img.width >= (img.height * 2.0)) {
        fileBackground.style.height = (img.height / img.width * maxWidth) + 'px'
        fileBackground.style.width = maxWidth
      } else {
        fileBackground.style.width = (img.width / img.height * maxWidth/2) + 'px'
        fileBackground.style.height = maxWidth/2
      }
    }
  }
})

sendButton.onclick = async () => {
  var title = titleField.value
  var file = fileField.files[0]

  // Reject if title or file are not present.
  if (title === null || file === null) { return }

  // Read in the image a a binary string to prep for upload, then upload.
  var reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    tools.createSnippet(reader.result, title)
  }
  reader.onerror = (e) => {
    console.log('Error reading image: ', error)
  }
}
