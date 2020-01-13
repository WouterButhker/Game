
console.log("HETT");
var square = document.getElementById("square");

for (let i = 0; i < 42; i++) {
    let circle = document.createElement("div");
    circle.classList.add("circle");
    circle.id = Math.floor(i/7) + "" + i%7;
    square.appendChild(circle);
}

document.getElementById("43").classList.add("red");
document.getElementById("53").classList.add("yellow");
