const {ipcRenderer} = require('electron');

// injection technique borrowed from http://stackoverflow.com/questions/840240/injecting-jquery-into-a-page-fails-when-using-google-ajax-libraries-api
window.onload = function () {
    var script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-2.1.4.min.js";
    script.onload = script.onreadystatechange = function () {
        $(document).ready(function () {

            //Set the zoom to 96% - fit easier in cards that way
            $("#zoom").val(96);
            $('.carddiv').height(319.0 * $('#zoom').val()/100 + 'px');
	        $('.carddiv').width(222.0 * $('#zoom').val()/100 + 'px');

            ipcRenderer.on('deckListReply', (event, arg) => {
                $("#decklist").val(arg);
                $("#form1").submit();
                ipcRenderer.send("show");
            });

            ipcRenderer.send('deckListQuery');
        });
    };
    document.body.appendChild(script);
};