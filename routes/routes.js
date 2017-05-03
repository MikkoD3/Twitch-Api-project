var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var db;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var objectId = require('mongodb').ObjectID;


MongoClient.connect('mongodb://admin:password@ds111461.mlab.com:11461/project3', (err, database) => {
  if (err) return console.log(err);
  db = database;
});
//Root Index route =================================================
app.get('/', function(req, res) {
  res.render('pages/index');
});

//Info Route =======================================================
app.get('/about', function(req, res) {
  db.collection('messages').find().toArray(function (err, result) {
  if (err) return console.log(err);

  res.render('pages/about', {messages: result});
});
});

//Admin Login route =========================================
app.get('/adminlogin', function(req, res) {
  res.render('pages/adminlogin');
});

//Form post handling ================================================
app.post('/about', function (req,res) {
  db.collection('messages').save(req.body, function (err,result) {
    if (err) return console.log(err);

    console.log('Saved to Database');
  });
    res.redirect('/about');
});

//Admin page route ====================================================
app.get('/admin', isLoggedIn, function(req, res, next) {
  db.collection('messages').find().toArray(function (err, result) {
  if (err) return console.log(err);

  res.render('pages/admin', {messages: result});
  });
});

//Function to check if admin is Logged in if someone tries to access the page ===============
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
  return next();

  res.redirect('/');
}

//Passport Module for Authenticating Admin ============================
passport.use('local', new LocalStrategy(
function(username, password, done) {
User.getUserByUsername(username, function(err, user) {
  if(err) throw err;
  if(!user) {
  //TESTING  return done(null, false, {message: 'Unknown User'});
   return done(null, false, { message: 'Unknown User' });
  }
  User.comparePassword(password, user.password, function(err, isMatch) {
    if(err) throw err;
    if(isMatch) {
      return done(null, user);
    } else {
      return done(null, false, {message: 'Invalid Password'});
    }
  })
})
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
      done(err, user);
  });
});

//Handle Admin Login ===================================
app.post('/adminlogin',
passport.authenticate('local', {successRedirect: '/admin', failureRedirect: '/adminlogin'}),
function(req,res) {
  console.log('Success!!');
res.redirect('/admin');
});

//Log Out for the Admin==================================
app.get('/logout', function(req,res) {
  req.logout();
    console.log("Admin Logged Out");
    res.redirect('/adminlogin');
});

//For deleting the messages ============================
app.delete('/about', function(req,res) {
  db.collection('messages').findOneAndDelete({guestnumber: req.body.guestnumber},
  function(err, result) {
    if (err) return res.send(500,err);
    res.json('Deleted!');
  });
});

//For Editing Messages ======================================
app.post('/update', function(req, res, next) {
  var item = {
    username: req.body.username,
    message: req.body.message,
    date: req.body.date
  };
  var id = req.body.id;

  db.collection('messages').updateOne({"_id": objectId(id)}, {$set: item},
   function(err, result) {
     if (err) return res.send(err);
    console.log("Item Updated");
  });
  res.redirect('/admin');
});



//Chatroom route ==========================================
app.get('/chatroom', function(req, res) {
  res.render('pages/chatroom');
});





//404 errors =========================================================
app.get('*', function(req,res) {
  res.status(404).send("<h1> 404 Not Found</h1>");
});


module.exports = app;
