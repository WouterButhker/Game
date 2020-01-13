console.log("HETT");
var square = document.getElementById("square");

let elapsedTime = -1;
let elapsedSeconds = 0;
let elapsedMinutes = 0;
let turnTimer = 31;

for (let i = 41; i >= 0; i--) {
    let circle = document.createElement("div");
    circle.classList.add("circle");
    circle.id = Math.floor(i / 7) + "" + i % 7;
    square.appendChild(circle);
}

document.getElementById("43").classList.add("red");
document.getElementById("53").classList.add("yellow");


timer();
setInterval(timer, 100);

function timer() {
    //Increment elapsed timer
    elapsedTime++;
    elapsedMinutes = Math.floor(elapsedTime / 60);
    elapsedSeconds = elapsedTime % 60;

    let optionalTimerZero = "";
    if (elapsedSeconds < 10) {
        optionalTimerZero = "0";
    }

    //Decrement turn timer
    turnTimer--;
    if (turnTimer < 0) {
        updateTurn();
        turnTimer = 30;
    }

    let optionalTurnZero = "";
    if (turnTimer < 10) {
        optionalTurnZero = "0";
    }

    document.getElementById("elapsed").innerHTML = "Time elapsed: " + elapsedMinutes + ":" + optionalTimerZero + elapsedSeconds;
    document.getElementById("turnTimer").innerHTML = "Turn timer: 0:" + optionalTurnZero + turnTimer;
}

function updateTurn() {
    let turnID = document.getElementById("turnID").innerHTML;
    dropFiche(1);
    if (turnID === "RED")
        document.getElementById("turnID").innerHTML = "YELLOW";
    if (turnID === "YELLOW")
        document.getElementById("turnID").innerHTML = "RED";
}

function dropFiche(y) {
    if (y < 0 || y > 6)
        return;
    for (let x = 0; x < 6; x++) {
        let classList = document.getElementById(x + "" + y).classList;
        let isRed = classList.contains("red");
        let isYellow = classList.contains("yellow");
        let turnID = document.getElementById("turnID").innerHTML;

        if (!(isRed || isYellow)) {
            classList.add(turnID.toLowerCase());
            break;
        }
    }
}