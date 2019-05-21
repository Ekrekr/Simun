const request = require('request')

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
  createSnippet: createSnippet
}

function standardise (data) {
  return JSON.parse(JSON.stringify(data))
}

function retrieveSnippet (id) {
  return new Promise((resolve, reject) => {
    request('http://localhost:7000/snippet/' + id, { json: true }, (err, res, body) => {
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
    request('http://localhost:7000/snippet/content/' + id, { json: true }, (err, res, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(standardise(body))
      }
    })
  })
}

function commentSnippet (snippetid, comment) {
  console.log('tools: commenting on snippet', snippetid, 'with', comment)

  return new Promise((resolve, reject) => {
    var requestInfo = {
      uri: 'http://localhost:7000/inbox/comment/',
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
        console.log('tools: error to client: ', err)
        console.log('tools: body response to client: ', res.body)
        resolve(res.body)
      }
    })
  })
}

async function forwardSnippet (snippetid, _callback) {
  console.log('tools: forwarding snippet', snippetid)

  var requestInfo = {
    uri: 'http://localhost:7000/inbox/forward-snippet/',
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
    return res.body
  })
}

async function createSnippet (content, description, redirectid, _callback) {
  console.log('tools: creating snippet content', content, 'with description', description, 'from redirect id', redirectid)

  var requestInfo = {
    uri: 'http://localhost:7000/outbox/create-snippet/',
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
    return res.body
  })
}
