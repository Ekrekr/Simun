var http = require("http");

// Called every time a request is received by the server. Receives and emits
// actions as a consequence. Event interfaces are:
// 'connect', 'connection', 'request', and 'upgrade'.
var server = http.createServer();

// upgrade    — emitted each time a client requests an upgrade of the
//              protocol (can be HTTP version).

// request - Emitted for Each request from the client (We would listen here).
server.on("request", (req, res) => {
});

// connect - Raised for all the ‘connect’ request by the HTTP client.
server.on("connect", (req, res) => {
});

// connection — Emitted when a new TCP stream is established. Provide access to
// the socket established.
server.on("connection", (req, res) => {
});

// upgrade -  each time a client requests an upgrade of the protocol (can be
// HTTP version).
server.on("upgrade", (req, res) => {
});

(req, res) => {


});
