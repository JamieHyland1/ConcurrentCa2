const cluster = require("cluster");
const numCPUs = require('os').cpus().length;
var server = require('http')
var express = require('express')
var app = express()
var bodyParser = require('body-parser');

var fs = require('fs');
var unstableNetwork = process.argv[2];

//-------------------------------------------------------------------------------------------------------
//CLUSTER CODE
//if this process is master, spawn the worker processes
if(cluster.isMaster){
    cluster.schedulingPolicy = cluster.SCHED_RR
    console.log("this is the master cluster at ",process.pid)
    for(var i = 0; i < numCPUs; i++){
       var worker = cluster.fork();
    }
    cluster.on("exit", worker => {
        console.log(`worker ${process.pid} has died.`);
        console.log(`${Object.keys(cluster.workers).length} remaining`)
        console.log("spawning new process")
        cluster.fork();
    })

 
    
}else if(cluster.isWorker){
    //this process is a worker
    app.listen(8000,()=>console.log(process.pid, "listening"));
    //app.use(bodyParser.json({limit: '150mb'}));
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        limit: '150mb',
        extended: true
    })); 
   

    if(unstableNetwork == "true"){
        var timeToLive = Math.floor(Math.random()*60000)
        setTimeout(()=>{process.exit()},timeToLive);
    }

    app.get("/",(req,res)=>{
        console.log(process.pid, " got a request");
        res.send(`hello world from ${process.pid}`);
    });

    app.get("/getChunks",(req,res)=>{
        let d = req.query.msg;
        let mdata = [];
        // console.log("request from client for chunks: ", d);

        mdata.push(d[0]);
        for (var i = 1; i < d.length; i++) {
            var start = d[i][2];
            var end = d[i][6];
            mdata.push([[start, end], getMetaData(getChunk(start, end))]);
        }
        res.send(mdata)
    });

    app.get("/startup",(req,res)=>{
        var data = [];
        data.push(3);
        data.push([["a", "g"], getMetaData(getChunk("a", "g"))]);
        data.push([["h", "o"], getMetaData(getChunk("h", "o"))]);
        data.push([["p", "z"], getMetaData(getChunk("p", "z"))]);
        res.send(data);
    });

    app.post("/uploadFile",(req,res)=>{
        var d = req.body.body
        d = d.split("\n")
        initializeDictionary(d);
        var data = [];
        data.push(3);
        data.push([["a", "g"], getMetaData(getChunk("a", "g"))]);
        data.push([["h", "o"], getMetaData(getChunk("h", "o"))]);
        data.push([["p", "z"], getMetaData(getChunk("p", "z"))]);
        res.send(data);
    });

    
    app.get("/download",(req,res)=>{
        let chunk = req.query.msg;
        var text = repeatRandomTimes(getChunk(chunk[0], chunk[1]));
        res.send(text);
    });
}
   


//-------------------------------------------------------------------------------------------------------
//SERVER CODE


//Retrieve the text file as one big string
var str = fs.readFileSync('data.txt', 'utf8');
//Convert into an array of strings, each string in the format number character character number
var d = str.split("\n");
var data = {};

initializeDictionary(d)


//create the dictionary of data for chunking
function initializeDictionary(d){ 
    data = {}
  for(var letter=97;letter<123;letter++)
  {
  var _char = String.fromCharCode(letter);
      data[_char] = []
  }
  for(var i = 0; i < d.length; i++){
    var chunkItem = d[i].split("\t");
    //console.log(chunkItem)
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


function repeatRandomTimes(chunk){

  var text = "";
  for (var i = 0; i < chunk.length; i++) {
    for (var j = 0; j < chunk[i].occurrences; j++) {
        // stream.write(chunk[i].value + "\n");
        text += chunk[i].value + "\n" ;
    }
  }
  return text;
}