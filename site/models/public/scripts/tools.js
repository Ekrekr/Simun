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
  request('http://localhost:7000/snippetcontent/' + id, { json: true }, (err, res, body) => {
    if (err) {
      console.log('tools: error retrieving snippet content')
      return _callback(err)
    }
    return _callback(null, JSON.parse(JSON.stringify(body)))
  })
}

async function forwardSnippet (snippetID, redirectID, _callback) {
  console.log('tools: forwarding snippet', snippetID, 'from redirect', redirectID)

  var requestInfo = {
    uri: 'http://localhost:7000/snippet/forward/',
    body: JSON.stringify({ snippetid: snippetID, redirectid: redirectID }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  request(requestInfo, function (err, res) {
    if (err) {
      console.log('tools: error forwarding snippet')
      return false
    }
    console.log('tools: error to client: ', err)
    console.log('tools: body response to client: ', res.body)
    return res.body
  })
}
