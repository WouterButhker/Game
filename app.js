/**
 * Set up basic web stuff
 * @type {createApplication}
 */

let express = require("express");
let http = require("http");
let websocket = require("ws");
let port = process.argv[2];
let app = express();
require("./routes/index")(app);
app.use(express.static(__dirname + "/public"));

// TODO meer games tegelijk fixen
let currentGames = [];
currentGames[0] = new Game();
let gameCounter = 1;

function Game() {
    this.player1 = null;
    this.player2 = null;
    this.gameNumber = 0;
    this.turn = "red";
    this.board = [];
    for (let i = 0; i < 7; i++) {
        this.board[i] = [];
    }

    this.fichesPlayed = 0;

    this.addPlayer = function (ws) {
        if (this.player1 == null) {
            this.player1 = ws;
            return true;
        } else if (this.player2 == null) {
            this.player2 = ws;
            return true
        } else {
            return false;
        }
    };
    this.bothPlayersPresent = function () {
        return this.player1 != null && this.player2 != null;
    };


    this.sendIdentities = function () {
        if (this.bothPlayersPresent()) {
            this.player1.send(this.player1.color);
            this.player2.send(this.player2.color);
        }
    };

    this.startGame = function () {
        if (this.bothPlayersPresent()) {
            this.sendToPlayers("startGame");
        }
    };

    this.sendToPlayers = function (message) {
        if (this.bothPlayersPresent()) {
            this.player1.send(message);
            this.player2.send(message);
            return true;
        } else {
            return false;
        }
    };

    this.drop = function (player, column) {
        console.log(this.board);

        for (let i = 0; i < 6; i++) {
            if (this.board[column][i] === undefined) {
                this.board[column][i] = player.color;
                this.nextTurn();
                return true;
            }
        }
        return false;
    };


    this.nextTurn = function () {
        if (this.turn === "red") this.turn = "yellow";
        else this.turn = "red";
        this.sendToPlayers("nextTurn");
    };
}


//
// var gameObj = {
//     player1: null,
//     player2: null,
//     gameNumber: 0,
//     turn: "red",
//     board: [],
//     init: function () {                      //Create 2d array for the board
//         this.board = [];
//         for (let i = 0; i < 7; i++) {
//             this.board[i] = [];
//         }
//     },
//     fichesPlayed: 0,
//     addPlayer: function (ws) {
//         if (this.player1 == null) {
//             this.player1 = ws;
//             return true;
//         } else if (this.player2 == null) {
//             this.player2 = ws;
//             return true
//         } else {
//             return false;
//         }
//     },
//     bothPlayersPresent: function () {
//         return this.player1 != null && this.player2 != null;
//     },
//
//     sendIdentities: function () {
//         if (this.bothPlayersPresent()) {
//             this.player1.send(this.player1.color);
//             this.player2.send(this.player2.color);
//         }
//     },
//     startGame: function () {
//         if (this.bothPlayersPresent()) {
//             this.sendToPlayers("startGame");
//         }
//     },
//     sendToPlayers: function (message) {
//         if (this.bothPlayersPresent()) {
//             this.player1.send(message);
//             this.player2.send(message);
//             return true;
//         } else {
//             return false;
//         }
//     },
//     drop: function (player, column) {
//         console.log(this.board);
//
//         for (let i = 0; i < 6; i++) {
//             if (this.board[column][i] === undefined) {
//                 this.board[column][i] = player.color;
//                 this.nextTurn();
//                 return true;
//             }
//         }
//         return false;
//     },
//     nextTurn: function () {
//         if (this.turn === "red") this.turn = "yellow";
//         else this.turn = "red";
//         this.sendToPlayers("nextTurn");
//     }
// };

//
// var statistics = {
//     numberOfPlayers: 0,
//     totalGamesPlayed: 0,
//     fastestGamePlayed: "none"
// };


let server = http.createServer(app);
const socket = new websocket.Server({server});

socket.on("connection", function (ws) {

    let game = currentGames[gameCounter - 1];
    game.addPlayer(ws);
    if (game.bothPlayersPresent())
    {
        currentGames[gameCounter] = new Game();
        gameCounter++;
        game.player1.color = "red";
        game.player2.color = "yellow";
        game.sendIdentities();
        game.startGame();
    }


    ws.on("message", function incoming(message) {
        //message = JSON.parse(message);
        console.log("[LOG] " + message);
        let isPlayer1 = game.player1 === ws;
        if (isPlayer1) console.log("Player 1: Put some shit in " + message);
        else console.log("Player 2: Put some shit in " + message);

        let color = isPlayer1 ? game.player1.color : game.player2.color;
        let player = isPlayer1 ? game.player1 : game.player2;
        let success = false;
        if (game.turn === color) {
            success = game.drop(player, message);
        }

        if (success) {

        }

        game.sendToPlayers(JSON.stringify(game.board));

    });
});


server.listen(port);


