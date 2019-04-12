var http = require("http");

// Called every time a request is received by the server. Receives and emits
// actions as a consequence. Event interfaces are:
// 'connect', 'connection', 'request', and 'upgrade'.
var server = http.createServer();

// Placeholder until real tests are needed. This is how to export functions for
// testing.
module.exports = {
  exampleFunc: function exampleFunc(input) {
    return !input;
  }
};

// request - Emitted for Each request from the client (We would listen here).
server.on("request", (request, response) => {
  var body = [];
  request
    .on("data", chunk => {
      body.push(chunk);
    })
    .on("end", () => {
      body = body.concat.toString();
      console.log("Server received ", body.toString());
    })
    .on("error", err => {
      console.error(err);
      response.statusCode = 400;
      response.end();
    });

  response.on("error", err => {
    console.error(err);
  });

  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json");
  response.write("Hello World!");
  response.end();
});

server.on("error", console.error);

// connect - Raised for all the ‘connect’ request by the HTTP client.
server.on("connect", (request, response) => {});

// connection - Emitted when a new TCP stream is established. Provide access to
// the socket established.
server.on("connection", (request, response) => {});

// upgrade -  each time a client requests an upgrade of the protocol (can be
// HTTP version).
server.on("upgrade", (request, response) => {});

/*****************************************/
/*               SERVER                  */
/*****************************************/

var path = require("path");

const express = require('express');
// const people = require('./people.json');

const app = express();

app.set('view engine', 'pug');
// app.set("views", path.join(__dirname, "views"));

// app.use(express.static(__dirname + '/public'));
app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Homepage',
    // user: 'something'
  });
});

const servers = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address()}`);
});

/*****************************************/
/*              Database                */
/*****************************************/

const sqlite3 = require("sqlite3").verbose();
const dbPath = path.resolve(__dirname, "../database/database.db");
let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the Login database.');
});
//GET
function get_data() {
  db.serialize(() => {
    db.each(`SELECT id,
                  forename as name
                  FROM Login`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      console.log(row.id + "\t" + row.name);
    });
  });
}
//PUT
//PlaceHolder - Will Get This From Pug
function put_data() {
  let placeholders = 'PLACEHOLDER';
  let sql = 'INSERT INTO Login VALUES ' + placeholders;

  // output the INSERT statement
  console.log(sql);

  db.run(sql, placeholders, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Rows inserted ${this.changes}`);
  });
}
//UPDATE
//PlaceHolder - Will Get This From Pug
function update_data() {
  let data = ['PLACEHOLDER', 'PLACEHOLDER'];
  let sql_update = `UPDATE Login
            SET forename = ?
            WHERE forename = ?`;

  db.run(sql_update, data, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);

  });
}
//DELETE
//PlaceHolder - Will Get This From Pug
//Will Give Error As ID Doesn't exist
function delete_row() {
  id = 100
  db.run(`DELETE FROM Login WHERE rowid=?`, id, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) deleted ${this.changes}`);
  });
}

// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
});