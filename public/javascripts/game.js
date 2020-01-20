let socket = new WebSocket("ws:connectfour.tech:80");
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
        if (data === "red") {
            document.getElementById("color").innerHTML = "Red";
            document.getElementById("color").className = "redText";
        } else {
            document.getElementById("color").innerHTML = "Yellow";
            document.getElementById("color").className = "yellowText";
        }
    } else if (data === "terminated") {
        clearInterval(timerID);
        document.getElementById("finished").innerHTML = "yes";
        document.getElementById("winner").innerHTML = "The other player has left the game";
    } else if (data === "startGame") {
        timer();
        timerID = setInterval(timer, 1000);
        document.getElementById("waiting").hidden = true;
    } else if (data.startsWith("finished")) {
        clearInterval(timerID);
        document.getElementById("finished").innerHTML = "yes";
        let winner = data.split("=")[1];
        if (winner === "red") {
            document.getElementById("winner").innerHTML = "The winner is RED";
        } else if (winner === "yellow")  {
            document.getElementById("winner").innerHTML = "The winner is YELLOW";
        } else {
            document.getElementById("winner").innerHTML = "Nobody wins!"
        }


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
                    let audio = new Audio('../resources/click.wav');
                    audio.play();
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
    if (turnID === "RED") {
        document.getElementById("turnID").innerHTML = "YELLOW";
        document.getElementById("turnID").className = "yellowText";
    }
    if (turnID === "YELLOW") {
        document.getElementById("turnID").innerHTML = "RED";
        document.getElementById("turnID").className = "redText";
    }

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
    document.getElementById("opponentName").innerHTML = opponentName
}



