let elapsedTime = 0;
let numberOfFiches = 0;
let timerID;
let finished = false;

let ficheArray = [];
for (let i = 0; i < 7; i++) {
    ficheArray[i] = [];
}

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
        dropFiche(i)
    });
}

timer();
timerID = setInterval(timer, 1000);
console.log("timer set!");


function timer() {
    let turnTimer = 30 - (elapsedTime % 30);
    let elapsedMinutes = Math.floor(elapsedTime / 60);
    let elapsedSeconds = elapsedTime % 60;

    let optionalTimerZero = "";
    if (elapsedSeconds < 10) {
        optionalTimerZero = "0";
    }

    if (elapsedTime % 30 === 0) {
        updateTurn();
    }

    let optionalTurnZero = "";
    if (turnTimer < 10) {
        optionalTurnZero = "0";
    }

    document.getElementById("elapsed").innerHTML = "Time elapsed: " + elapsedMinutes + ":" + optionalTimerZero + elapsedSeconds;
    document.getElementById("turnTimer").innerHTML = "Turn timer: 0:" + optionalTurnZero + turnTimer;

    if (numberOfFiches >= 42) {
        finish();
    }
    elapsedTime ++;
}

function updateTurn() {
    if (scanH(true) || scanH(false))
        return;
    let turnID = document.getElementById("turnID").innerHTML;
    if (turnID === "RED")
        document.getElementById("turnID").innerHTML = "YELLOW";
    if (turnID === "YELLOW")
        document.getElementById("turnID").innerHTML = "RED";
    turnTimer = 30;
}

function dropFiche(y) {
    if (y < 0 || y > 6 || finished)
        return false;
    for (let x = 0; x < 6; x++) {
        let classList = document.getElementById(x + "" + y).classList;
        let isRed = classList.contains("red");
        let isYellow = classList.contains("yellow");
        let turnID = document.getElementById("turnID").innerHTML;

        if (!(isRed || isYellow)) {
            classList.add(turnID.toLowerCase());
            ficheArray[x][y] = turnID.toLowerCase();
            numberOfFiches++;
            updateTurn();
            return true;
        }
    }
    return false;
}

function finish() {
    document.getElementById("finished").innerHTML = "yes";
    console.log("FINISHED!!");
    finished = true;
    clearInterval(timerID);
}

function scanH(horizontal) {
    // TODO: refactor better
    // wtf is a b c d
    // kan beter
    let c, d;
    if (horizontal) {
        c = 6;
        d = 7;
    } else {
        c = 7;
        d = 6;
    }

    for (let a = 0; a < c; a++) {
        let lastColor = null;
        let consecutive = 1;
        for (let b = 0; b < d; b++) {
            let currentColor;
            if (horizontal) currentColor = ficheArray[a][b];
            else currentColor = ficheArray[b][a];

            if (currentColor === lastColor && currentColor != null)
                consecutive++;
            else
                consecutive = 1;
            lastColor = currentColor;
            if (consecutive === 4) {
                document.getElementById("winner").innerHTML = "The winner is " + currentColor;
                console.log("The winner is " + currentColor);
                // TODO
                console.log(a + ", " + b);
                finish();
                return true;
            }
        }
    }
    return false;
}

function logColors() {
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            let currentColor = ficheArray[x][y];
            console.log("Array indexes: " + x + ", " + y);
            console.log(currentColor);
        }
    }
}

function kill() {
    clearInterval(timerID);
}

function sendMove(move) {
    let socket = new WebSocket("ws://localhost:3000");
    socket.onmessage = function (event) {
        console.log(event.data);
    }
    socket.onopen = function () {
        socket.send(JSON.stringify(move));
    };
}

function colorFiche(move)
{

}




