const socket = require("socket.io");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require('axios')
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
  console.log("Sending hello to App.js!");
  axios.get("http://localhost:8000/").then((res)=>{
      console.log(res.data, " from app.js")
  }).catch((err)=>{console.log(err)})
  

  socket.on('new_chunks', function(msg){
    console.log(msg);
    axios.get('http://localhost:8000/getChunks', 
    {params: { "msg": msg}})
    .then((res)=>{
        console.log("Recieved from App.js ", res.data)
        socket.emit("new_chunks",res.data)
    }).catch(error=>console.log(error));
  });

  socket.on('new_file', function(file_str){
    console.log("new file", file_str)
  });

  socket.on('disconnect', function() {
    console.log("Client has Disconnected");
  });
}); 

module.exports = app;
