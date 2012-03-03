// Telegraph.js
//
// Turns the flatiron app into a websocket powered 
// EventEngine
// -------------------------------------------------- //

var flatiron = require('flatiron'),
    app      = flatiron.app;

module.exports = {
    
    name: 'telegraph',

    attach: function (options) {

        //
        // Extend the application
        //
        app.io = require('socket.io').listen(app.server);
        
        
        // Syntax sugar for socket.io events
        app.on = function(name, action) {
            app.io.sockets.on(name, action);
        };

        app.emit = function(name, data) {
            app.io.sockets.emit(name, data);
        };

        app.volley = function(name, data) {
            app.io.sockets.volatile.emit(name, data);
        };


        // Production Settings
        // -------------------------------------------------- //
        app.io.configure('production', function() {

            app.io.enable('browser client minification');  // send minified client
            app.io.enable('browser client etag');          // apply etag caching logic based on version number
            app.io.enable('browser client gzip');          // gzip the file
            app.io.set('log level', 1);                    // reduce logging
            app.io.set('transports', [                     // enable all transports (optional if you want flashsocket)
                'websocket'
                , 'flashsocket'
                , 'htmlfile'
                , 'xhr-polling'
                , 'jsonp-polling'
            ]);

        });

    },

    init: function (done) {

        // Initialize anything your plugin needs,
        // asynchronously if necessary, then call done().
        //

        done();

    }
};
