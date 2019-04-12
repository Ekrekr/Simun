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

// server.listen(8008, () => {
//   console.log("Server listening at 8008");
// });

// // Express Server Integration
// var express = require("express");
// var router = express.Router();
// var app = express();


// // Gets the file from the selected root directory
// router.get("/", function (req, res) {
//   res.sendFile("login.html", {
//     root: path.join(__dirname, "/../public")
//   });
// });

// Gets the file from the selected root directory
// router.get("/", function (req, res) {
//   res.sendFile("login.pug", {
//     root: path.join(__dirname, "/../models/public")
//   });
// });

// // Gets the file from the selected root directory
// router.get("/", function (req, res, next) {
//   res.render('login.html')
// });


// Location that the express server has been started at
// app.listen(8000, function () {
//   console.log("Express server started");
// });

// Called by express.static.  Deliver response as XHTML.
// function deliverXHTML(res, path, stat) {
//   if (path.endsWith(".html")) {
//     res.header("Content-Type", "application/xhtml+xml");
//   }
// }

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
//PUT
//PlaceHolder - Will Get This From Pug
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
//UPDATE
//PlaceHolder - Will Get This From Pug
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
//DELETE
//PlaceHolder - Will Get This From Pug
id = 100
db.run(`DELETE FROM Login WHERE rowid=?`, id, function (err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Row(s) deleted ${this.changes}`);
});

// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
});