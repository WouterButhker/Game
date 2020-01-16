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
var currentGames = [];
var gameCounter = 0;



/**
 * Object representing a single game
 * @type {{drop: gameObj.drop, init: gameObj.init, player1: null, addPlayer: gameObj.addPlayer, sendToPlayers: gameObj.sendToPlayers, player2: null, gameNumber: number, fichesPlayed: number, bothPlayersPresent: (function(): boolean|boolean), turn: string, board: []}}
 */


var gameObj = {
    player1: null,
    player2: null,
    gameNumber: 0,
    turn: "red",
    board: [],
    init: function () {                      //Create 2d array for the board
        this.board = [];
        for (let i = 0; i < 7; i++) {
            this.board[i] = [];
        }
    },
    fichesPlayed: 0,
    addPlayer: function (ws) {
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

    sendIdentities: function () {
        if (this.bothPlayersPresent()) {
            this.player1.send(this.player1.color);
            this.player2.send(this.player2.color);
        }
    },
    startGame: function () {
        if (this.bothPlayersPresent()) {
            this.sendToPlayers("startGame");
        }
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
        console.log(this.board);

        for (let i = 0; i < 6; i++) {
            if (this.board[column][i] === undefined) {
                this.board[column][i] = player.color;
                this.nextTurn();
                return true;
            }
        }
        return false;
    },
    nextTurn: function(){
        if (this.turn === "red") this.turn = "yellow";
        else this.turn = "red";
        this.sendToPlayers("nextTurn");
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

    let bool = gameObj.addPlayer(ws);
    //ws.send("Player connected \nSucces: " + bool);

    if (gameObj.bothPlayersPresent()) {
        gameObj.init();
        console.log("Server: LETS GO!!!");
        currentGames[gameCounter] = gameObj;
        gameCounter ++;
        gameObj.player1.color = "red";
        gameObj.player2.color = "yellow";
        gameObj.sendIdentities();
        gameObj.startGame();
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
        //console.table(gameObj.board);

        gameObj.sendToPlayers(JSON.stringify(gameObj.board));

    });
});


server.listen(port);


