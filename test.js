var fs = require('fs');
var test = "b"

//Retrieve the text file as one big string
var str = fs.readFileSync('data.txt', 'utf8');
//Convert into an array of strings, each string in the format number character character number
var data = str.split("\n");
 
//write results to file
//TODO cleanup writing to file to improve performance
function parseChunk(a,b){
    let wordCount = {};
    let letterCount = {};
    
    var regex = new  RegExp("(^\\d*)((\\s)*(\\b[" + a + "-" + b + "][a-z]*))*(\\s)(\\d*)");

    let output = []
    for(var i = 0; i < data.length; i++){
        if(data[i].match(regex) != null){
            output.push(data[i].match(regex)[0]);
        }
     }
    
    for(var i = 0; i < output.length; i++){
        var s = output[i];
        var x = s.split(" ");
        let key = s.match((/\b[a-z][a-z]*/)); //returns an array >:(

        if(key != null){
             for(let j = 0; j < key[0].length;j++){
                 if(!(key[0][j] in letterCount)) letterCount[key[0][j]] = 1; else letterCount[key[0][j]]++;
             }
        }
        if(!(key in wordCount)) wordCount[key] = 1; else wordCount[key]++;
    }
    fs.writeFileSync("output.txt","Here are the words and their frequency\n", function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
      fs.appendFileSync("output.txt",JSON.stringify(wordCount,null," "), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
      fs.appendFileSync("output.txt","Here is a count of each letter that occured in the chunk\n", function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
      fs.appendFileSync("output.txt",JSON.stringify(letterCount,null," "), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
   
     let keys = Object.keys(wordCount);
    // console.log("Number of unique words in the specified chunk", keys.length);
    fs.appendFileSync("output.txt","Number of unique words in the specified chunk\n", function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
      fs.appendFileSync("output.txt",JSON.stringify(keys,null," "), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    wordCount = {}
    letterCount = {}
    
}
//TODO:// Write file with random number of words randomly repeated
setTimeout(()=>parseChunk("a", "b"),1000);