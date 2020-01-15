var express = require('express');
var router = express.Router();


module.exports = function(app) {


  app.get('/', function (req, res, next) {
    //res.render('index', { title: 'Express' });
    res.sendFile("splash.html", {root: "./public"})
  });

  app.get('/play', function (req, res) {
    res.sendFile("game.html", {root: "./public"})
  });

};
