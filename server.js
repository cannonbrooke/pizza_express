var express = require('express');
var app = express();
var jade = require('jade');
var config = require('./config.json');
var bodyparser = require('body-parser');
var path = require('path');
var session = require('express-session');
var models = require('./models');
var User = models.User;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use (new LocalStrategy(
  function(username, password, done){
    console.log("Local Strategy", username, password);
    done();
  })
);

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyparser.urlencoded({entended: false}));

app.get('/users', function (req, res){
  return res.join ({message: 'success!'});
});

app.get('/login', function (req, res){
  return res.render ('form');
});



app.post('/login', passport.authenticate('local', {
  successRedirect: '/users/',
  failureRedirect: '/login',
  session: false
}));



models.sequelize
  .sync()
  .then(function () {
    var server = app.listen(3000,function(){
  console.log('Test.');
  });
 });





