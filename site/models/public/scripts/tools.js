const request = require('request')

module.exports = {
  colorblack: '#000000',
  colordark: '#2f4550',
  colorprimary: '#586f7c',
  colorlight: '#b8dbd9',
  colorwhite: '#f4f4f9',
  colorshadow: '#00000080',
  retrieveSnippetContent: retrieveSnippetContent,
  forwardSnippet: forwardSnippet
}

function retrieveSnippetContent (id, _callback) {
  request('http://localhost:7000/data/snippetcontent/' + id, { json: true }, (err, res, body) => {
    if (err) { return _callback(err) }
    return _callback(null, JSON.parse(JSON.stringify(body)))
  })
}

function forwardSnippet (snippetID, _callback) {
  request.post({
    url:     'http://localhost:7000/snippet/forward/',
    form:    { id: snippetID }
  }, function(error, response, body){
    console.log('body to client: ', body)
    console.log('response to client: ', response)
    return _callback(null, JSON.parse(JSON.stringify(body)))
  });
}