var square = document.getElementById("square");

let elapsedTime = -1;
let elapsedSeconds = 0;
let elapsedMinutes = 0;
let turnTimer = 31;
let numberOfFiches = 0;
let ficheArray;
let timerID;
let lastFiche;
let finished = false;

ficheArray = [];
for (let i = 0; i < 7; i++) {
    ficheArray[i] = [];
}

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
    column.addEventListener("click", function(){dropFiche(i)});
}

timer();
timerID = setInterval(timer, 1000);
console.log("timer set!");


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

    if (numberOfFiches >= 42) {
        finish();
    }

}

function updateTurn() {
    if (scanHorizontal() || scanVertical())
        return;
    let turnID = document.getElementById("turnID").innerHTML;
    // let valid = dropFiche(Math.floor(Math.random() * 7));
    // while ((!valid) && numberOfFiches < 42)
    //     valid = dropFiche(Math.floor(Math.random() * 7));
    if (turnID === "RED")
        document.getElementById("turnID").innerHTML = "YELLOW";
    if (turnID === "YELLOW")
        document.getElementById("turnID").innerHTML = "RED";
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
            lastFiche = classList;
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

function scanHorizontal(){
    for (let y = 0; y < 7; y++) {
        let lastColor = null;
        let consecutive = 1;
        for (let x = 0; x < 6; x++) {
            let currentColor = ficheArray[y][x];
            if (currentColor === lastColor && currentColor != null)
                consecutive++;
            else
                consecutive = 1;
            lastColor = currentColor;
            if (consecutive === 4) {
                document.getElementById("winner").innerHTML = "The winner is " + currentColor;
                console.log("The winner is " + currentColor);
                console.log(y + ", " + x);
                finish();
                return true;
            }
        }
    }
    return false;
}

function scanVertical(){
    for (let x = 0; x < 6; x++) {
        let lastColor = null;
        let consecutive = 1;
        for (let y = 0; y < 7; y++) {
            let currentColor = ficheArray[y][x];
            if (currentColor === lastColor && currentColor != null)
                consecutive++;
            else
                consecutive = 1;
            lastColor = currentColor;
            if (consecutive === 4) {
                document.getElementById("winner").innerHTML = "The winner is " + currentColor;
                console.log("The winner is " + currentColor)
                console.log(y + ", " + x);
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

function kill(){
    clearInterval(timerID);
}




