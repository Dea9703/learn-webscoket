var app = require("express")();
var server = require("http").Server(app);
var WebSocket = require("ws");
const crypto = require("crypto");

const magic = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
const secWebSocketKey = "w4v7O6xFTi36lq3RNcgctw==";

var wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  console.log("server: receive connection.");

  ws.on("message", function incoming(message) {
    console.log("server: received: %s", message);
  });

  ws.send("world");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "../index.html");
});

let secWebSocketAccept = crypto
  .createHash("sha1")
  .update(secWebSocketKey + magic)
  .digest("base64");

console.log(secWebSocketAccept); // Oy4NRAQ13jhfONC7bP8dTKb4PTU=

app.listen(3000, () => {
  console.log("server on running");
});
