var express = require('express');
var app = express();
var jade = require('jade');
var config = require('./config/config.json');
var bodyparser = require('body-parser');
var path = require('path');
var session = require('express-session');
var models = require('./models');
var User = models.User;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var sessions = require('express-session');

passport.serializeUser(function(user, done){
  console.log("serializing user...");
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  return User.findOne({
    where: {'id': id }
  })
  .then(function (user){
    done(null, user);
  });

  });



passport.use (new LocalStrategy(
  function(username, password, done){
    User.findOne({
      where: { "username": username }
    })

    .then(function (user) {
      if(!user){
        console.log("WRONG, NO USER");
        return done(null, false, { message: "user not found"});
      }
      else if (user.password !== password){
        console.log("WRONG!");
        return done (null, false, { message: "incorrect password"});
      }
      done(null, user);
    })
    //.finally(done);
    .catch(done);
  })
);

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyparser.urlencoded({entended: false}));
app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());

app.get('/users',
  function (req, res, next){
  if (req.isAuthenticated()){ //console logging if they are authenticated
  return next();
}
  res.redirect('/login');
},
function (req, res){
  console.log('Success!');
  return res.json ({message: 'success!'});
});

app.get('/login', function (req, res){
  return res.render ('form');
});



app.post('/login', passport.authenticate('local', {
  successRedirect: '/users/',
  failureRedirect: '/login',
  session: true
}));



models.sequelize
  .sync()
  .then(function () {
    var server = app.listen(3000,function(){
  console.log('Test.');
  });
 });





