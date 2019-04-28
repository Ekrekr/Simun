const request = require('request')

module.exports = {
  colorblack: '#000000',
  colordark: '#2f4550',
  colorprimary: '#586f7c',
  colorlight: '#b8dbd9',
  colorwhite: '#f4f4f9',
  colorshadow: '#00000080',
  retrieveData: retrieveData
}

// Retrieves data by asking the server for it.
function retrieveData (table, id, _callback) {
  request('http://localhost:7000/data/' + table + '/' + id, {
    json: true
  }, (err, res, body) => {
    if (err) {
      return _callback(err)
    }
    return _callback(null, JSON.parse(JSON.stringify(body)))
  })
}
