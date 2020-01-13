var express = require('express');
var router = express.Router();


// splash screen
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendFile("splash.html", {root: "./public"})
});

// game screen
router.get('/play', function (req, res) {
  res.sendFile("game.html", {root: "./public"})
});



module.exports = router;
