// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

var fileField = $('snippet-file-input')
var fileBackground = $('snippet-file-container')

// When someone uploads a file, select the file being uploaded.
fileField.addEventListener('change', (e) => {
  // The multiple field is not allowed, so the file will always be at the 0th index.
  var selectedFile = fileField.files[0]

  // Once the file has loaded, read it.
  var reader = new window.FileReader()
  reader.readAsDataURL(selectedFile)
  reader.onload = (e) => {
    fileBackground.style.backgroundImage = 'url(' + e.target.result + ')'

    // Retreive the image dimensions then scale the upload box background from there.
    var img = new Image()
    img.src = reader.result
    img.onload = () => {
      // If the image is wider than it is tall, then to maximise the area occupied set the width
      // to the width of the divider and the height to the maxium height while keeping the
      // correct aspect ratio. Do the opposite if the image is taller than it is wide.
      if (img.width >= (img.height * 2.0)) {
        fileBackground.style.height = (img.height / img.width * 400) + 'px'
        fileBackground.style.width = 400
      } else {
        fileBackground.style.width = (img.width / img.height * 200) + 'px'
        fileBackground.style.height = 200
      }
    }
  }
})
