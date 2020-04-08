$(document).ready(function() {
    $(window).keydown(function(event){
        // prevent "enter" key from sending form
        if(event.keyCode == 13) {
        event.preventDefault();
        return false;
        }
    });
});

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


function chunkSel() {
    var val = $('#num-chunks').val();
    $('#chunks-wrap').empty();
    // add input for chunks
    var j = 0;
    for (var i = 1; i <= val; i++) {
        if (i == 1) {
            $('<label class="d-block control-label">Chunk ' + i + '</label>').appendTo($('#chunks-wrap'));
            $('<div id= "side-' + i + '" class="input-group mb-2"></div>').appendTo($('#chunks-wrap'));
            // A default for 1st chunk
            $('<input type="text" class="form-control text-uppercase" placeholder="Start" value="A" disabled/>').appendTo($('#side-'+i));
            $('<input type="text"  class="form-control text-uppercase" placeholder="End" pattern="[A-Za-z]{1}" title="Only 1 Letter" required/>').appendTo($('#side-'+i));
            j++;
        }
        else if (i == val) {
            $('<label class="d-block control-label">Chunk ' + i + '</label>').appendTo($('#chunks-wrap'));
            $('<div id= "side-' + i + '" class="input-group mb-5"></div>').appendTo($('#chunks-wrap'));
            $('<input type="text" class="form-control text-uppercase" placeholder="Start" pattern="[A-Za-z]{1}" title="Only 1 Letter" required/>').appendTo($('#side-'+i));
            // Z default for last chunk
            $('<input type="text" class="form-control text-uppercase" placeholder="End" value="Z" disabled/>').appendTo($('#side-'+i));
        }
        else {
            $('<label class="d-block control-label">Chunk ' + i + '</label>').appendTo($('#chunks-wrap'));
            $('<div id= "side-' + i + '" class="input-group mb-2"></div>').appendTo($('#chunks-wrap'));
            $('<input type="text" class="form-control text-uppercase" placeholder="Start"  pattern="[A-Za-z]{1}" title="Only 1 Letter" required/>').appendTo($('#side-'+i));
            j++;
            $('<input type="text" class="form-control text-uppercase" placeholder="End"  pattern="[A-Za-z]{1}" title="Only 1 Letter" required/>').appendTo($('#side-'+i));
            j++;
        }
    }
}