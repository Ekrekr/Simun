const request = require('request')

module.exports = {
  colorblack: '#000000',
  colordark: '#2f4550',
  colorprimary: '#586f7c',
  colorlight: '#b8dbd9',
  colorwhite: '#f4f4f9',
  colorshadow: '#00000080',
  retrieveSnippetContent: retrieveSnippetContent,
  forwardSnippet: forwardSnippet,
  createSnippet: createSnippet
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

async function forwardSnippet (snippetid, _callback) {
  console.log('tools: forwarding snippet', snippetid)

  var requestInfo = {
    uri: 'http://localhost:7000/forward-snippet/',
    body: JSON.stringify({ snippetid: snippetid }),
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

async function createSnippet (content, description, redirectid, _callback) {
  console.log('tools: creating snippet content', content, 'with description', description, 'from redirect id', redirectid)

  var requestInfo = {
    uri: 'http://localhost:7000/create-snippet/',
    body: JSON.stringify({ content: content, description: description, redirectid: redirectid }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  request(requestInfo, function (err, res) {
    if (err) {
      console.log('tools: error creating snippet')
      return false
    }
    console.log('tools: error to client: ', err)
    console.log('tools: body response to client: ', res.body)
    return res.body
  })
}
