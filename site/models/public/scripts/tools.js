const request = require('request')

module.exports = {
  colorblack: '#000000',
  colordark: '#2f4550',
  colorprimary: '#586f7c',
  colorlight: '#b8dbd9',
  colorwhite: '#f4f4f9',
  colorshadow: '#00000080',
  retrieveSnippetContent: retrieveSnippetContent
}

function retrieveSnippetContent (id, _callback) {
  request('http://localhost:7000/data/snippetcontent/' + id, { json: true }, (err, res, body) => {
    if (err) { return _callback(err) }
    return _callback(null, JSON.parse(JSON.stringify(body)))
  })
}

function retrieveSnippet (id, _callback) {
  request('http://localhost:7000/data/snippets/' + id, { json: true }, (err, res, body) => {
    if (err) { return _callback(err) }
    return _callback(null, JSON.parse(JSON.stringify(body)))
  })
}

function forwardSnippet (id, _callback) {
  request('http://localhost:7000/snippets/forward/' + id, { json: true }, (err, res, body) => {
    if (err) { return _callback(err) }
    return _callback(null, JSON.parse(JSON.stringify(body)))
  })
}