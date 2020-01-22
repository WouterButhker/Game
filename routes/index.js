let express = require('express');
let router = express.Router();


module.exports = function(app) {

  // app.use(function (req, res, next) {
  //     let cookie = req.cookies;
  //     if (cookie === undefined) {
  //       let num = Math.random().toString();
  //       num = num.substring(2, num.length);
  //       res.cookie("cookieName", num);
  //       console.log("created cookie")
  //     } else {
  //       console.log("Welcome back")
  //     }
  //     next();
  // });


  app.get('/', function (req, res, next) {
    res.render('splash.ejs');
    // res.sendFile("splash.html", {root: "./public"})
  });

    app.get('/play', function (req, res) {
        res.sendFile("game.html", {root: "./public"})
    });

};
