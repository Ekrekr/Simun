var tools = require('./tools.js')

var currentlyActive = 0

// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

var fileField = $('snippet-file-input')
var fileBackground = $('snippet-file-container')

// When someone uploads a file, select the file being uploaded.
fileField.addEventListener('change', (e) => {
  // The multiple field is not allowed, so the file will always be at the 0th index.
  var selectedFile = fileField.files[0]

  // Once the file has loaded, read it.
  var reader = new FileReader();
  reader.readAsDataURL(selectedFile);
  reader.onload = (e) => {
    fileBackground.style.backgroundImage = 'url(' + e.target.result + ')';

    // Retreive the image dimensions then scale the upload box background from there.
    var img = new Image;
    img.src = reader.result;
    img.onload = () => {
      console.log("The width of the image is " + img.width + "px.");
    };
  };
})