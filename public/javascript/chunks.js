function checkExt() {
    if(document.file_upload.text_file.value.lastIndexOf(".txt") == -1) {
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
});

$('.exit').click(function() {
	$('#chunks-form').css("display","none");
});


function chunkSel() {
    var val = $('#num-chunks').val();
    var mode = $('#mode-chunks').val();
    // add input for chunks
    for (var i = 1; i <= val; i++) {
        if (mode == "word"){

        }
        else if (mode == "id") {

        }
        else if (mode == "count"){

        }
    }
}