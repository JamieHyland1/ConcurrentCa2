var socket;

socket = io.connect('http://localhost:3000');




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
            var txtFile = reader.result;
            socket.emit('new_file', txtFile);
        }
        reader.readAsText(gtxtFile[0]);

        e.preventDefault();
    });


    $('#new-chunks').submit(function(e) {
        $('#chunks-form').css("display","none");
        var chunkNum = $('#num-chunks').val();
        var chunks = [];
        chunks.push(chunkNum);
        for (var i = 1; i <= chunkNum; i++) {
            var chunk = [];
            chunk.push($('#chunk_start_'+i).val());
            chunk.push($('#chunk_end_'+i).val());
            chunks.push(chunk);
        }
        socket.emit('new_chunks', chunks);
        e.preventDefault();
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
}