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
document.cookie = "numberOfTimesAccessed=" + numberOfTimesAccessedByThisClient + "; expires=Mon, 20-Jul-2020 06:45:00 GMT";
document.getElementById("gamesPlayedByPlayer").innerHTML = numberOfTimesAccessedByThisClient;