var http = require("http");
var server = http.createServer();
var database = require("./database.js");

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
const express = require("express");
const app = express();
var router = express.Router();
var bodyParser = require("body-parser");

//parse requests
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);


app.set("views", path.join(__dirname, "../models/public"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.json());

router.get("/", function (req, res) {
  res.redirect("index.html");
});

router.post("/login", async function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  await authenticate(res, username, password);
});

async function authenticate(res, username, password) {
  var authentication = database.getData("Login", username);
  authentication.then(async function (result) {
    let newUsername = await database.hashingEntry(username);
    let newPassword = await database.hashingEntry(password);
    console.log(newUsername)
    if (
      database.compareHash(result[0].username, newUsername) &&
      database.compareHash(result[0].password, newPassword)
    ) {
      res.redirect("index.html");
    } else {
      res.redirect("login.html");
    }
  });
}

router.get("/login", function (req, res) {
  res.redirect("login.html");
});

router.get("/receive", function (req, res) {
  res.redirect("receive.html");
});

router.get("/send", function (req, res) {
  res.redirect("send.html");
});

router.get("/stats", function (req, res) {
  res.redirect("stats.html");
});

router.get("/index", function (req, res) {
  res.redirect("index.html");
});

app.use("/", router);

connectToServer();

function connectToServer() {
  app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address()}`);
  });
}