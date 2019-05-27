const request = require('request')
var identifiers = require('../../identifiers.js')

// Shorthand for getting elements by ID.
var $ = function (id) { return document.getElementById(id) }

module.exports = {
  colorblack: '#000000',
  colordark: '#2f4550',
  colorprimary: '#586f7c',
  colorlight: '#b8dbd9',
  colorwhite: '#f4f4f9',
  colorshadow: '#00000080',
  standardise: standardise,
  retrieveSnippet: retrieveSnippet,
  commentSnippet: commentSnippet,
  retrieveSnippetContent: retrieveSnippetContent,
  forwardSnippet: forwardSnippet,
  trashSnippet: trashSnippet,
  reportSnippet: reportSnippet,
  createSnippet: createSnippet
}

function standardise (data) {
  return JSON.parse(JSON.stringify(data))
}

function retrieveSnippet (id) {
  return new Promise((resolve, reject) => {
    request(identifiers.address + '/snippet/' + id, { json: true }, (err, res, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(standardise(body))
      }
    })
  })
}

function retrieveSnippetContent (id) {
  return new Promise((resolve, reject) => {
    request(identifiers.address + '/snippet/content/' + id, { json: true }, (err, res, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(standardise(body))
      }
    })
  })
}

function commentSnippet (snippetid, comment) {
  console.log('Commenting on snippet')
  return new Promise((resolve, reject) => {
    var requestInfo = {
      uri: identifiers.address + '/inbox/comment/',
      body: JSON.stringify({ snippetid: snippetid, comment: comment }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    request(requestInfo, function (err, res) {
      if (err) {
        console.log('tools: error commenting on snippet')
        reject(false)
      } else {
        document.location.reload()
        resolve(res.body)
      }
    })
  })
}

async function forwardSnippet (snippetid) {
  return new Promise((resolve, reject) => {
    var requestInfo = {
      uri: identifiers.address + '/inbox/forward-snippet/',
      body: JSON.stringify({ snippetid: snippetid }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    request(requestInfo, function (err, res) {
      if (err) {
        console.log('tools: error forwarding snippet')
        reject(false)
      } else {
        resolve(res.body)
      }
    })
  })
}

async function trashSnippet (snippetid) {
  return new Promise((resolve, reject) => {
    var requestInfo = {
      uri: identifiers.address + '/inbox/trash-snippet/',
      body: JSON.stringify({ snippetid: snippetid }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    request(requestInfo, function (err, res) {
      if (err) {
        console.log('tools: error trashing snippet')
        reject(false)
      } else {
        resolve(res.body)
      }
    })
  })
}

async function reportSnippet (snippetid) {
  return new Promise((resolve, reject) => {
    var requestInfo = {
      uri: identifiers.address + '/inbox/trash-snippet/',
      body: JSON.stringify({ snippetid: snippetid }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    request(requestInfo, function (err, res) {
      if (err) {
        console.log('tools: error reporting snippet')
        reject(false)
      } else {
        resolve(res.body)
      }
    })
  })
}

function uploadToImgur (file, title) {
  console.log('tools: Uploading to Imgur')

  file = file.replace(/^data:image\/[a-z]+;base64,/, '')

  return new Promise((resolve, reject) => {
    var requestInfo = {
      uri: 'https://api.imgur.com/3/image',
      body: JSON.stringify({ image: file, type: 'base64', title: title }),
      method: 'POST',
      headers: {
        'Authorization': 'Client-ID 546c25a59c58ad7',
        'Content-Type': 'application/json'
      }
    }
    request(requestInfo, (err, res) => {
      if (err) {
        $('error-message').innerHTML = 'Error uploading file.'
        reject(false)
      } else {
        var parsed = JSON.parse(res.body)
        resolve(parsed.data.link)
      }
    })
  })
}

async function createSnippet (file, title) {
  console.log('Creating snippet')
  var imgUrl = await uploadToImgur(file, title).then(res => { return res })
  console.log('Image uploaded to imgur')

  return new Promise((resolve, reject) => {
    var requestInfo = {
      uri: identifiers.address + '/outbox/create-snippet/',
      body: JSON.stringify({ imgurl: imgUrl, title: title }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    request(requestInfo, function (err, res) {
      if (err) {
        console.log('tools: error creating snippet')
        $('error-message').innerHTML = 'Error creating snippet.'
        reject(false)
      } else {
        $('error-message').innerHTML = 'Snippet sent!'
        resolve(res.body)
      }
    })
  })
}
