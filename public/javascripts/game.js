let socket = new WebSocket("ws://localhost:3000");
let elapsedTime = 0;
let secondsLeft = 30;
let timerID;

/**
 * Server connectivity stuff
 */
socket.onopen = function() {
    console.log("Successfully connected to server")
};

socket.onmessage = function(event) {
    let data = event.data;
    if (data === "red" || data === "yellow"){
        document.getElementById("color").innerHTML = data;
        return;
    }

    if (data === "startGame"){
        timer();
        timerID = setInterval(timer, 1000);
    }

    if (data === "finished"){
        clearInterval(timerID);
        document.getElementById("finished").innerHTML = "yes";
        document.getElementById("winner").innerHTML = "The winner is " + document.getElementById("turnID").innerHTML;
    }

    if (data === "nextTurn")
    {
        updateTurn();
        return;
    }

    let board = JSON.parse(data)
    //console.table(board);

    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 7; x++) {
            if (board[x][y] !== undefined) {
                document.getElementById(y + "" + x).classList.add(board[x][y]);
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
        socket.send(i + "");
        console.log("Client: Put some shit in " + i);
    });
}

function timer() {
    refreshPage();
    elapsedTime ++;
    secondsLeft --;
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

function refreshPage(){
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

    document.getElementById("elapsed").innerHTML = "Time elapsed: " + elapsedMinutes + ":" + optionalTimerZero + elapsedSeconds;
    document.getElementById("turnTimer").innerHTML = "Turn timer: 0:" + optionalTurnZero + secondsLeft;
}




//
// function logColors() {
//     for (let x = 0; x < 7; x++) {
//         for (let y = 0; y < 6; y++) {
//             let currentColor = ficheArray[x][y];
//             console.log("Array indexes: " + x + ", " + y);
//             console.log(currentColor);
//         }
//     }
// }
//
// function kill() {
//     clearInterval(timerID);
// }
//
// function sendMove(move) {
//     let socket = new WebSocket("ws://localhost:3000");
//     socket.onmessage = function (event) {
//         console.log(event.data);
//     }
//     socket.onopen = function () {
//         socket.send(JSON.stringify(move));
//     };
// }
//
// function colorFiche(move)
// {
//
// }




