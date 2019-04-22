var path = require('path')
const express = require('express')
var database = require('./database.js')
const request = require('request')

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

// Retrieve data from the database
app.get('/data/:table/:id', (req, res) => {
  console.log('Retrieving data from table "' + req.params.table + '" and id', req.params.id)
  // if (req.params.table === 'snippetcontent') {
  database.getData(req.params.table, req.params.id).then(response => {
    res.send(JSON.stringify(response[0]))
  })
  // } else {
  //   res.send(null)
  // }
})

// Retrieves data by asking the server for it.
function retrieveData (table, id, _callback) {
  request('http://localhost:7000/data/' + table + '/' + id, { json: true }, (err, res, body) => {
    if (err) { return _callback(err) }
    return _callback(null, JSON.parse(JSON.stringify(body)))
  })
}

// Page retrieval
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/login', (req, res) => {
  res.sendfile('login.html')
})

app.get('/receive', (req, res) => {
  // File to pass to pug to tell it what value to give variables.
  var variables = {}
  variables.selected = {}
  variables.snippets = []

  // Need to load snippet data from the database to display on the page.
  retrieveData('redirect', 0, (err, redirect) => {
    if (err) {
      console.log('Error retrieving redirect from server:', err)
      return
    }

    var snippets = JSON.parse(redirect.snippetids)

    // For each snippet, retrieve the snippet content ID.
    snippets.forEach((entry, index) => {
      retrieveData('snippets', entry, (err, snippet) => {
        if (err) {
          console.log('Error retrieving snippets from server:', err)
          return
        }

        // Retrieve the snippet content.
        retrieveData('snippetcontent', snippet.contentid, (err, snippetcontent) => {
          if (err) {
            console.log('Error retrieving snippetcontent from server:', err)
            return
          }

          variables.snippets.push({ 'description': snippetcontent.description,
            'content': snippetcontent.content,
            'id': snippetcontent.id })

          // Only return final source if final iteration.
          if (index === snippets.length - 1) {
            // Send the created page back to user after loading all the variables,
            // with a slight delay to prevent further problems.
            setTimeout(function () { res.render('receive', variables) }, 100)
          }
        })
      })
    })
  })
})

app.get('/send', (req, res) => {
  res.sendfile('send.html')
})

app.get('/stats', (req, res) => {
  res.sendfile('stats.html')
})

/*****************************************/
/*               SERVER                  */
/*****************************************/
var path = require("path");
const express = require("express");
const app = express();
var router = express.Router();
var bodyParser = require("body-parser");
app.get('/receive.js', (req, res) => {
  res.sendfile('scripts/receive.js')
})

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