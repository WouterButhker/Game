let socket = new WebSocket("ws://localhost:3000");
let elapsedTime = 0;
let secondsLeft = 30;
let timerID;
let opponentName = "Anonymous Owl";

/**
 * Server connectivity stuff
 */
socket.onopen = function () {
    console.log("Successfully connected to server")
};

socket.onmessage = function (event) {
    let data = event.data;

    if (data === "red" || data === "yellow") {
        document.getElementById("color").innerHTML = data;
        return;
    } else if (data === "terminated") {
        clearInterval(timerID);
        document.getElementById("finished").innerHTML = "yes";
        document.getElementById("winner").innerHTML = "The other player has left the game";
    } else if (data === "startGame") {
        timer();
        timerID = setInterval(timer, 1000);
    } else if (data === "finished") {
        clearInterval(timerID);
        document.getElementById("finished").innerHTML = "yes";
        document.getElementById("winner").innerHTML = "The winner is " + document.getElementById("turnID").innerHTML;
    } else if (data === "nextTurn") {
        updateTurn();
    } else if (data.startsWith("opponent=")) {
        opponentName = data.split("=")[1];
    } else {
        let board = JSON.parse(data);
        //console.table(board);

        for (let y = 0; y < 6; y++) {
            for (let x = 0; x < 7; x++) {
                if (board[x][y] !== undefined) {
                    document.getElementById(y + "" + x).classList.add(board[x][y]);
                }
            }
        }
    }
};

/**
 * Graphics stuff
 */
// create board
for (let i = 41; i >= 0; i--) {
    let circle = document.createElement("div");
    circle.classList.add("circle");
    circle.id = Math.floor(i / 7) + "" + i % 7;
    document.getElementById("square").appendChild(circle);
}

// create clickable columns
for (let i = 0; i < 7; i++) {
    let column = document.createElement("div");
    column.classList.add("column");
    column.id = i.toString();
    document.getElementById("columns").appendChild(column);
    column.addEventListener("click", function () {
        socket.send("name=" + document.getElementById("nickname").value);
        socket.send(i + "");
    });
}

function timer() {
    refreshPage();
    elapsedTime++;
    secondsLeft--;
}

//
function updateTurn() {
    let turnID = document.getElementById("turnID").innerHTML;
    if (turnID === "RED")
        document.getElementById("turnID").innerHTML = "YELLOW";
    if (turnID === "YELLOW")
        document.getElementById("turnID").innerHTML = "RED";

    secondsLeft = 30;
    refreshPage();
}

function refreshPage() {
    let elapsedMinutes = Math.floor(elapsedTime / 60);
    let elapsedSeconds = elapsedTime % 60;

    let optionalTimerZero = "";
    if (elapsedSeconds < 10) {
        optionalTimerZero = "0";
    }

    let optionalTurnZero = "";
    if (secondsLeft < 10) {
        optionalTurnZero = "0";
    }

    document.getElementById("elapsed").innerHTML = "Time elapsed: " + elapsedMinutes + ":" + optionalTimerZero + elapsedSeconds + "<br/>";
    document.getElementById("turnTimer").innerHTML = "Turn timer: 0:" + optionalTurnZero + secondsLeft + "<br/>";
    document.getElementById("opponentName").innerHTML = opponentName;
}



