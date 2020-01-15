let express = require("express");
let http = require("http");

let websocket = require("ws");
let port = process.argv[2];
let app = express();
require("./routes/index")(app);
app.use(express.static(__dirname + "/public"));

ficheArray = [];
for (let i = 0; i < 7; i++) {
    ficheArray[i] = [];
}



let server = http.createServer(app).listen(port);
const socket = new websocket.Server({server});

socket.on("connection", function (ws) {
    console.log("Connection state: " + ws.readyState);
    ws.send("Thanks for the message. --Your server.");
    console.log("Connection state: " + ws.readyState);

    ws.on("message", function incoming(message) {
        message = JSON.parse(message);
        console.log("[LOG] " + message.color);
    });
});


