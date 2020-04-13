var server = require('http').Server();
var io = require('socket.io')(server);

server.listen(8000,()=>{console.log("running on port 8000")});
const bodyParser = require("body-parser");
var fs = require('fs');
//Retrieve the text file as one big string
var str = fs.readFileSync('data.txt', 'utf8');
//Convert into an array of strings, each string in the format number character character number
var d = str.split("\n");

var data = {};


io.set('transports', ['websocket']);

io.sockets.on('connection', function(socket) {
  console.log("New Client: " + socket.id);

  socket.on('new_chunks', function(data){
    var d = data[0].split("\n");
    initializeDictionary(d);

    mdata = [];
    mdata.push(data[1]);
    for (var i = 2; i < data.length; i++) {
      var start = data[i][0];
      var end = data[i][1];
      mdata.push([[start, end], getMetaData(getChunk(start, end))]);
    }
    socket.emit('new_chunks', mdata);
  });
  socket.on('new_file', function(file_str){
    var d = file_str.split("\n");
    initializeDictionary(d);

    var mdata = [];
    mdata.push(3);
    mdata.push([["a","g"], getMetaData(getChunk("a","g"))]);
    mdata.push([["h","o"], getMetaData(getChunk("h","o"))]);
    mdata.push([["p","z"], getMetaData(getChunk("p","z"))]);
    socket.emit('new_file', mdata);
  });
  socket.on('disconnect', function() {
    console.log("Client " + socket.id + " Disconnected");
  });
}); 

var data = {};

//create the dictionary of data for chunking
function initializeDictionary(d){ 
  for(var letter=97;letter<123;letter++)
  {
  var _char = String.fromCharCode(letter);
      data[_char] = []
  }
  for(var i = 0; i < d.length; i++){
    var chunkItem = d[i].split("\t");
    let key = chunkItem[1].charAt(0).toLowerCase();
    if(!(key in data)){
        data[key] = [{"index": chunkItem[0], "value": chunkItem[1], "occurrences":chunkItem[3]}];
    }else{
        data[key].push({"index": chunkItem[0], "value": chunkItem[1], "occurrences":chunkItem[3]});
    }
  }
}

function getChunk(chunk_start, chunk_end){
    chunk_start_index = chunk_start.charCodeAt();
    chunk_end_index = chunk_end.charCodeAt();
    let chunk = []

    while (chunk_start_index <= chunk_end_index) {
      var letter = String.fromCharCode(chunk_start_index).toLowerCase();
      if(data[letter]) chunk = chunk.concat(data[letter]);
      chunk_start_index++;
    }
    return chunk;
}



function getMetaData(chunk) {
  var metadata = [];
  var count = 0;
  var max_w = 0;
  var single_occ = 0;
  var max_word;
  for (var i = 0; i < chunk.length; i++) {
    occurrences = parseInt(chunk[i].occurrences);
    count += occurrences;
    if (occurrences > max_w) {
      max_w = occurrences;
      max_word = chunk[i].value;
    }
    if (occurrences == 1) {
      single_occ += 1;
    }
  }
  metadata.push(count);
  metadata.push(chunk.length);
  metadata.push(max_word);
  metadata.push(single_occ);

  return metadata;
}


function getWordsInChunk(chunk){
    let wordsInChunk = {}
    console.log(chunk.length)
    for(var i = 0; i < chunk.length;i++){
        var val = chunk[i].value;
        var k = val.split(" "); //we only want the first word

        var key = k[0];
        if(!(key in wordsInChunk)) wordsInChunk[key] = 1; else wordsInChunk[key]++; 
    }
}

function getLetterCountInChunk(chunk){
    let letterCountInChunk = {}
    console.log(chunk.length)
    for(var i = 0; i < chunk.length;i++){
        var val = chunk[i].value;
        var k = val.split(" "); //we only want the first word
        var key = k[0];
        for(var j = 0; j < key.length; j++){
            if(!(key[j] in letterCountInChunk)) letterCountInChunk[key[j]] = 1; else letterCountInChunk[key[j]]++;
        }
    }
    console.log(letterCountInChunk)
}

function repeatRandomTimes(a,b){
    var obj1,obj2;
    obj1 = data[a][Math.floor(Math.random()*data[a].length)]
    obj2 = data[b][Math.floor(Math.random()*data[b].length)]

    var stream = fs.createWriteStream("output.txt");
    stream.once('open', function(fd) {
        for(var i = 0; i < obj1.occurrences; i++){
            stream.write(obj1.value + "\n")
        }
        for(var i = 0; i < obj2.occurrences; i++){
            stream.write(obj2.value + "\n")
        }
        stream.end();
    });
}