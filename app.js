const socket = require("socket.io");
const express = require("express");
const path = require("path");

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index');
});
   

var server = app.listen(3000, () => {
  console.log(`server is running on port`, server.address().port);
});

   