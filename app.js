const socket = require("socket.io");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var fs = require('fs');

var routes = require('./routes/index');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.set('view engine', 'pug');

app.use('/', routes);

var server = app.listen(3000, () => {
  console.log(`server is running on port`, server.address().port);
});

var io = socket(server);

io.sockets.on('connection', function(socket) {
  console.log("New Client: " + socket.id);

  socket.on('new_chunks', function(msg){
    console.log(socket.id + ": " + msg);
  });

  socket.on('new_file', function(file_str){
    console.log("File Output: \n" + file_str);
  });

  socket.on('disconnect', function() {
    console.log("Client has Disconnected");
  });
}); 

module.exports = app;
   