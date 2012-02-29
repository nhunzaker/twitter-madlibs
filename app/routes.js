// Routes

var app = require("flatiron").app,
    fs  = require("fs");

app.router.get("/", function() {

    var req = this.req,
        res = this.res;

    fs.readFile(__dirname + "/index.html", function (err, data) {
		    
        if (err) {
		        res.writeHead(500);
		        return res.end('Error loading index.html');
		    }

		    res.writeHead(200);
		    res.end(data);

	  });

});