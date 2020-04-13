var socket;

socket = io(({transports: ['websocket'], upgrade: false})).connect('http://localhost:3000');

var chunks = [];

var txtFile;

socket.on('new_file', function(data){
    var chunk_num = data[0];
    chunks.push(data[1]);
    chunks.push(data[2]);
    chunks.push(data[3]);
    init_btn(chunk_num);
    $('.tbl-meta').css("display","block");
    $('.nav-btn').prop("disabled", false);
    chunk_data(1);
});


socket.on('new_chunks', function(data) {
    chunks = [];
    var chunk_num = data[0];
    for (var i = 1; i < data.length; i++) {
        chunks.push(data[i]);
    }
    init_btn(chunk_num);
    chunk_data(1);
});


function init_btn(num) {
    $('#chunk-ul').empty();
    for (var i = 1; i <= num; i++) {
        $('<li id="chunk-li-'+i+'" class="py-2 nav-item mx-4"></li>').appendTo($('#chunk-ul'));
        if (i==1)
            $('<button id="chunk-btn-'+i+'" class="chunk-btn btn px-4 py-1 nav-link bg-white" onClick="chunk_click(this.id)" disabled> Chunk '+i+'</button>').appendTo($('#chunk-li-'+i));
        else
        $('<button id="chunk-btn-'+i+'" class="chunk-btn btn px-4 py-1 nav-link bg-white" onClick="chunk_click(this.id)"> Chunk '+i+'</button>').appendTo($('#chunk-li-'+i));
    }
}

function chunk_click(id) {
    $('.chunk-btn').prop("disabled", false);
    $('#'  + id).prop("disabled", true);
    chunk_data(parseInt(id.slice(-1)));
}

function chunk_data(num) {
    var c = chunks[num-1][0];
    var data = chunks[num-1][1];
    $('#meta-title').html("Chunk " + num);
    $('#meta-p').html("Chunk is split from '" + c[0] + "' to '" + c[1] + "'");
    $('#word-count').html(data[0]);
    $('#unique-word').html(data[1]);
    $('#max-count').html(data[2]);
    $('#single-occ').html(data[3]);
}


$(document).ready(function() {
    $(window).keydown(function(event){
        // prevent "enter" key from sending form
        if(event.keyCode == 13) {
        event.preventDefault();
        return false;
        }
    });

    $('#file_upload').submit(function(e) {
        $('#upload-form').css("display","none");
        var gtxtFile = $('#txt-file').prop('files');

        const reader = new FileReader();
        reader.onload = function () {
            txtFile = reader.result;
            socket.emit('new_file', txtFile);
        }
        reader.readAsText(gtxtFile[0]);

        e.preventDefault();
    });


    $('#new-chunks').submit(function(e) {
        $('#chunks-form').css("display","none");
        var chunkNum = $('#num-chunks').val();
        var chunks = [];
        chunks.push(txtFile);
        chunks.push(chunkNum);
        for (var i = 1; i <= chunkNum; i++) {
            var chunk = [];
            chunk.push($('#chunk_start_'+i).val());
            chunk.push($('#chunk_end_'+i).val());
            chunks.push(chunk);
        }
        socket.emit('new_chunks', chunks);
        e.preventDefault();
        return false;
    });
});


// make sure file uploaded is a txt file
function checkExt() {
    if(document.file_upload.text_file.value.lastIndexOf(".txt") == -1) {
        $('#txt-file').val('');
        alert("Please upload only .txt extention file");
        return false;
    }
}


// open/close New Text File form pop up
$('#upload').click(function() {
	$('#upload-form').css("display","block");
});

$('.exit').click(function() {
	$('#upload-form').css("display","none");
});


// open/close New Chunks form pop up
$('#chunks').click(function() {
    $('#chunks-form').css("display","block");
    chunkSel();
});

$('.exit').click(function() {
	$('#chunks-form').css("display","none");
});


// add as many inputs as chunks selected
function chunkSel() {
    var val = $('#num-chunks').val();
    $('#chunks-wrap').empty();
    // add input for chunks
    for (var i = 1; i <= val; i++) {
            $('<label class="d-block control-label">Chunk ' + i + '</label>').appendTo($('#chunks-wrap'));
            $('<div id= "side-' + i + '" class="input-group mb-2"></div>').appendTo($('#chunks-wrap'));
            $('<input id="chunk_start_'+i+'" type="text" class="form-control text-uppercase" placeholder="Start"  pattern="[A-Za-z]{1}" title="Only 1 Letter" required/>').appendTo($('#side-'+i));
            $('<input id="chunk_end_'+i+'" type="text" class="form-control text-uppercase" placeholder="End"  pattern="[A-Za-z]{1}" title="Only 1 Letter" required/>').appendTo($('#side-'+i));
    }
    console.log("Done");
}