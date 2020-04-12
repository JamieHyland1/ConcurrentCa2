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



//create the dictionary of data for chunking
function initializeDictionary(){    
for(var letter=97;letter<123;letter++)
{
var _char = String.fromCharCode(letter);
    data[_char] = []
}
for(var i = 0; i < d.length; i++){
    var chunkItem = d[i].split("\t");
    let key = chunkItem[1].charAt(0).toLowerCase();
    if(!(key in data)){
        data[key] = [{"value": chunkItem[1], "index": chunkItem[0], "repeatTimes":chunkItem[3]}];
    }else{
        data[key].push({"value": chunkItem[1], "index": chunkItem[0], "repeatTimes":chunkItem[3]});
    }
}

}
function getChunk(a,b){
    let chunk = []
    if(data[a.toLowerCase()]) chunk = [].concat(data[a.toLowerCase()]);
    if(data[b.toLowerCase()]) chunk = chunk.concat(data[b.toLowerCase()]);
    return chunk;
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
        for(var i = 0; i < obj1.repeatTimes; i++){
            stream.write(obj1.value + "\n")
        }
        for(var i = 0; i < obj2.repeatTimes; i++){
            stream.write(obj2.value + "\n")
        }
        stream.end();
    });
}