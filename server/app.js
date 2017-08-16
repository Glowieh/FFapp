var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var api = require('./routes/api');

var app = express();

//database
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var mongoDB = '127.0.0.1:27017';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/api', api);

//Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// error handler for the API
app.use(function(err, req, res, next) {
  // only provide error in dev mode
  let msg = req.app.get('env') === 'development' ? err : err.message;

  res.status(err.status || 500);
  res.send(JSON.stringify({error: msg}));
});

module.exports = app;
