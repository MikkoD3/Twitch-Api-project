//Server.js

var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server)
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient;
var routes = require('./routes/routes');
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:password@ds111461.mlab.com:11461/project3');
var db = mongoose.connection;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var io = require('socket.io').listen(server);
var db;
var exports = module.exports = {};



//static Content



app.set('view engine', 'ejs');
app.use(express.static('views'));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));


app.use(morgan('dev'));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);





MongoClient.connect('mongodb://admin:password@ds111461.mlab.com:11461/project3', (err, database) => {
  //start server.
  if (err) return console.log(err);
  db1 = database;
});


 server.listen(8081, () => {
    console.log('app listening on port 8081');
});

users = [];
io.sockets.on('connection', function(socket) {
  console.log('A user connected');

  socket.on('setUsername', function(data){
      console.log(data);
      if(users.indexOf(data) > -1){
        socket.emit('userExists', data + ' username is taken! Try some other username.');
      }
      else{
        users.push(data);
        socket.emit('userSet', {username: data});
      }
    });
    socket.on('msg', function(data){
        //Send message to everyone
        io.sockets.emit('newmsg', data);
    })
  });

exports.closeServer = function() {
  server.close();
}
