let express = require('express');
let router = express.Router();
let stats = require('../public/stats.js');


module.exports = function (app) {
    app.get('/', function (req, res, next) {
        res.render('splash.ejs', {
            currentGames: stats.currentGames,
            gamesPlayed: stats.gamesPlayed,
            fastestTime: stats.fastestGame + " seconds"
        });
    });

    app.get('/play', function (req, res) {
        res.sendFile("game.html", {root: "./public"})
    });

};
