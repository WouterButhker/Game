console.log("HETT");

let elapsedTime = -1;
let elapsedSeconds = 0;
let elapsedMinutes = 0;
let turnTimer = 31;

let numberOfFiches = 0;

for (let i = 41; i >= 0; i--) {
    let circle = document.createElement("div");
    circle.classList.add("circle");
    circle.id = Math.floor(i / 7) + "" + i % 7;
    document.getElementById("square").appendChild(circle);
}

for (let i = 0; i < 7; i++) {
    let column = document.createElement("div");
    column.classList.add("column");
    column.id = i.toString();
    document.getElementById("columns").appendChild(column);
}

timer();
setInterval(timer, 10);


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
    let valid = dropFiche(Math.floor(Math.random() * 7));
    while ( (!valid) && numberOfFiches < 42)
        valid = dropFiche(Math.floor(Math.random() * 7));
    if (turnID === "RED")
        document.getElementById("turnID").innerHTML = "YELLOW";
    if (turnID === "YELLOW")
        document.getElementById("turnID").innerHTML = "RED";
}

function dropFiche(y) {
    if (y < 0 || y > 6)
        return false;
    for (let x = 0; x < 6; x++) {
        let classList = document.getElementById(x + "" + y).classList;
        let isRed = classList.contains("red");
        let isYellow = classList.contains("yellow");
        let turnID = document.getElementById("turnID").innerHTML;

        if (!(isRed || isYellow)) {
            classList.add(turnID.toLowerCase());
            numberOfFiches ++;
            return true;
            break;
        }
    }
    return false;
}