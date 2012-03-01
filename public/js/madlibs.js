// Twitter Map
$(function() {
    
    //-- Initialize ---------------------------------------------------------------//
    
    var connect = window.location.protocol + "//" + window.location.hostname,
        socket  = io.connect(connect),
        i = 1;

    socket.on("tweet", function (data) {

        var lib = $("<li/>").html("<strong>" + i + "</strong>: " + data.text);

        $("#madlibs").append(lib).append("<li><hr/></li>");
        
        i++;
    });

});