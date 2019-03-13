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

server.listen(8008, () => {
  console.log("Server listening at 8008");
});

// Express Server Integration
var express = require("express");

var app = express();

var path = require("path");

// Gets the file from the selected root directory
app.get("/", function(req, res) {
  res.sendFile("login.html", { root: path.join(__dirname, "/../public") });
});

// Location that the express server has been started at
app.listen(8000, function() {
  console.log("Express server started");
});

// Called by express.static.  Deliver response as XHTML.
function deliverXHTML(res, path, stat) {
  if (path.endsWith(".html")) {
    res.header("Content-Type", "application/xhtml+xml");
  }
}

var sql = require("mssql");

const config = {
  user: "",
  password: "",
  server: "localhost",
  database: "..//databse//database.db"
};

sql.connect(config).then(() => {
  return sql.query`select * FROM Login`
}).then(result => {
  console.log(result)
}).catch(err => {
  console.log(err)
})

sql.on('error', err => {
  // ... error handler
})

async () => {
  console.log("here")
  try {
    console.log("Works")
    let conn = await sql.connect(config);
    let result = await conn.query(
      "SELECT id, username, password FROM Login"
    );
    console.log(result)
    if (result.isValid == false) {
      console.log("Result is not valid, maybe no entries in database?");
    } else {
      while (result.isValid) {
        // do something with the result
        var id = result.value(0);
        var username = result.value(1);
        var password = result.value(2);
        console.log(id + forename + surname + email + phone);
        //addEntry(forename, surname, email, phone)
        result.toNext();
      }
      //test.log("added " + id + " entries in the addressbook application")
    }
  } catch (err) {
    console.log("couldn't connect" + err);
  }
};

/*const sqlite3 = require("sqlite3").verbose();
const dbPath = path.resolve(__dirname, "../database/database.db");
/*let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});
var conn = sql.connect(config,
  err => {
    if (err) {
      console.error(err.message);
    }
  }
);*/
