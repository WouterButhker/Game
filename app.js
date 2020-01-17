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
let stats = require("./public/stats.js");
app.use(express.static(__dirname + "/public"));


let currentGames = [];
currentGames[0] = new Game();
let gameCounter = 1;
setInterval(clock, 1000);

function Game() {
    this.player1 = null;
    this.player2 = null;
    this.turn = "red";
    this.board = [];
    this.secondsLeft = 30;
    this.ongoing = false;
    for (let i = 0; i < 7; i++) {
        this.board[i] = [];
    }

    this.fichesPlayed = 0;

    this.addPlayer = function (ws) {
        if (this.player1 == null) {
            this.player1 = ws;
            this.player1.name = "Anonymous Owl";
            return true;
        } else if (this.player2 == null) {
            this.player2 = ws;
            this.player2.name = "Anonymous Pinguin";
            return true
        } else {
            return false;
        }
    };
    this.removePlayer = function (ws) {
        if (this.player1 === ws)
            this.player1 = null;
        else if (this.player2 === ws)
            this.player2 = null;
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
            this.ongoing = true;
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
        if (!this.ongoing) return false;
        column = parseInt(column);
        for (let i = 0; i < 6; i++) {
            if (this.board[column][i] === undefined) {
                this.board[column][i] = player.color;
                this.nextTurn(column, i);
                return true;
            }
        }
        return false;
    };

    this.nextTurn = function (x, y) {
        //let finished = this.checkFinished(true) || this.checkFinished(false);
        let finished = this.betterCheck(x, y);
        this.player1.send("opponent=" + this.player2.name);
        this.player2.send("opponent=" + this.player1.name);
        this.sendToPlayers(JSON.stringify(this.board));
        if (finished) {
            this.finish();
            return;
        }
        if (this.turn === "red") this.turn = "yellow";
        else this.turn = "red";
        this.secondsLeft = 30;
        this.sendToPlayers("nextTurn");
    };

    this.betterCheck = function (x, y) {
        let colorToCheck = this.board[x][y];
        if (colorToCheck !== "red" && colorToCheck !== "yellow")
            return false;
        let this2 = this;

        function recursiveWinCheck(x, y, direction) {
            let outOfBounds = x < 0 || x > 6 || y < 0 || y > 5;
            if (outOfBounds || this2.board[x][y] !== colorToCheck) {
                return 0;
            }

            switch (direction) {
                case "left" :
                    return 1 + recursiveWinCheck(x - 1, y, "left");
                case "right" :
                    return 1 + recursiveWinCheck(x + 1, y, "right");
                case "up" :
                    return 1 + recursiveWinCheck(x, y + 1, "up");
                case "down" :
                    return 1 + recursiveWinCheck(x, y - 1, "down");
                case "up right" :
                    return 1 + recursiveWinCheck(x + 1, y + 1, "up right");
                case "down left" :
                    return 1 + recursiveWinCheck(x - 1, y - 1, "down left");
                case "down right" :
                    return 1 + recursiveWinCheck(x + 1, y - 1, "down right");
                case "up left" :
                    return 1 + recursiveWinCheck(x - 1, y + 1, "up left");
            }
        }

        let horizontal = 1 + recursiveWinCheck(x - 1, y, "left") + recursiveWinCheck(x + 1, y, "right");
        let vertical = 1 + recursiveWinCheck(x, y + 1, "up") + recursiveWinCheck(x, y - 1, "down");
        let diagonalR = 1 + recursiveWinCheck(x + 1, y + 1, "up right") + recursiveWinCheck(x - 1, y - 1, "down left");
        let diagonalL = 1 + recursiveWinCheck(x + 1, y - 1, "down right") + recursiveWinCheck(x - 1, y + 1, "up left");

        let win = horizontal > 3 || vertical > 3 || diagonalL > 3 || diagonalR > 3;
        return win;

    };

    this.finish = function () {
        this.sendToPlayers("finished");
        this.ongoing = false;
    }

}

let server = http.createServer(app);
const socket = new websocket.Server({server});

socket.on("connection", function (ws) {

    let game = currentGames[gameCounter - 1];
    game.addPlayer(ws);
    if (game.bothPlayersPresent()) {
        currentGames[gameCounter] = new Game();
        gameCounter++;
        stats.currentGames = gameCounter;
        game.player1.color = "red";
        game.player2.color = "yellow";
        game.sendIdentities();
        game.startGame();
    }


    ws.on("message", function incoming(message) {
        let isPlayer1 = game.player1 === ws;
        let color = isPlayer1 ? game.player1.color : game.player2.color;
        let player = isPlayer1 ? game.player1 : game.player2;

        if (message.startsWith("name=")) {
            let newName = message.split("=")[1];
            if (newName !== "")
                player.name = newName;
            return;
        }

        let success = false;
        if (game.turn === color) {
            success = game.drop(player, message);
        }

        if (success) {

        }
    });

    ws.on("close", function closing(x, y) {
            console.log("F");
            game.removePlayer(ws);
            if (game.player1 !== null)
                game.player1.send("terminated");
            if (game.player2 !== null)
                game.player2.send("terminated");
            game.ongoing = false;
        }
    )
});


function clock() {
    for (let i = 0; i < currentGames.length; i++) {
        let game = currentGames[i];
        if (game.ongoing) {
            if (game.secondsLeft === 0) {
                game.secondsLeft = 30;
                game.nextTurn(0, 0);
            } else {
                game.secondsLeft--;
            }
        }
    }
}

server.listen(port);


