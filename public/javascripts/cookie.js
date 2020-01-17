let numberOfTimesAccessedByThisClient = 0;
let cookieList = document.cookie.split('; ');
let cookies = [];

for (let i = 0; i < cookieList.length; i++) {
    let cookie = cookieList[i].split("=");
    if (cookie[0] === "numberOfTimesAccessed") {
        numberOfTimesAccessedByThisClient = parseInt(cookie[1]);
        break;
    }
}
numberOfTimesAccessedByThisClient++;
document.cookie = "numberOfTimesAccessed=" + numberOfTimesAccessedByThisClient;
document.getElementById("gamesPlayedByPlayer").innerHTML = numberOfTimesAccessedByThisClient;