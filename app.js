let express = require("express");
let http = require("http");

let websocket = require("ws");
let port = process.argv[2];
let app = express();
require("./routes/index")(app);
app.use(express.static(__dirname + "/public"));

// ficheArray = [];
// for (let i = 0; i < 7; i++) {
//     ficheArray[i] = [];
// }
//
//

// TODO meer games tegelijk fixen
var currentGames = [];
var gameCounter = 0;


var gameObj = {
    player1: null,
    player2: null,
    gameNumber: 0,
    turn: "red",
    board: [],
    init: function() {
        this.board = [];
        for (let i = 0; i < 7; i++) {
            this.board[i] = [];
        }
    },
    fichesPlayed: 0,
    addPlayer: function(ws) {
        if (this.player1 == null) {
            this.player1 = ws;
            return true;
        } else if (this.player2 == null) {
            this.player2 = ws;
            return true
        } else {
            return false;
        }
    },
    bothPlayersPresent: function () {
        return this.player1 != null && this.player2 != null;
    },
    sendToPlayers: function (message) {
        if (this.bothPlayersPresent()) {
            this.player1.send(message);
            this.player2.send(message);
            return true;
        } else {
            return false;
        }
    },
    drop: function (player, column) {
        //let col = ;

        console.log(this.board);

        for (let i = 0; i < 6; i++) {
            if (this.board[column][i] === undefined) {
                this.board[column][i] = player.color;

                if (this.turn === "red") this.turn = "yellow";
                else this.turn = "red";
                return true;
            }
        }
        return false;
    }
};

//
// var statistics = {
//     numberOfPlayers: 0,
//     totalGamesPlayed: 0,
//     fastestGamePlayed: "none"
// };


let server = http.createServer(app);
const socket = new websocket.Server({server});

socket.on("connection", function (ws) {

    let bool =  gameObj.addPlayer(ws);
    //ws.send("Player connected \nSucces: " + bool);

    if (gameObj.bothPlayersPresent()) {
        //gameObj.sendToPlayers("LETS GO!!!");
        gameObj.init();
        console.log("Server: LETS GO!!!");
        currentGames[gameCounter] = gameObj;
        gameObj.player1.color = "red";
        gameObj.player2.color = "yellow";
    }

    ws.on("message", function incoming(message) {
        //message = JSON.parse(message);
        //console.log("[LOG] " + message);
        let isPlayer1 = gameObj.player1 === ws;
        if (isPlayer1) console.log("Player 1: Put some shit in " + message);
        else console.log("Player 2: Put some shit in " + message);

        let color = isPlayer1 ? gameObj.player1.color : gameObj.player2.color;
        let player = isPlayer1 ? gameObj.player1 : gameObj.player2;
        let success = false;
        if (gameObj.turn === color) {
            success = gameObj.drop(player, message);
        }
        //if (!success) player.send("Server: Move refused");

        if (success) {

        }
        console.table(gameObj.board);

        gameObj.sendToPlayers(JSON.stringify(gameObj.board));

    });
});


server.listen(port);


