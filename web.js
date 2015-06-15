// Define routes for simple SSJS web app. 
var express = require('express')
   , fs      = require('fs');

var app = express();
app.set('port', process.env.PORT || 8080);


// Render homepage (note trailing slash): example.com/
app.get('/', function(request, response) {
    var data = fs.readFileSync('boot.html').toString();
    response.send(data);
});

app.get('/login', function(request, response) {
    var data = fs.readFileSync('work.html').toString();
    response.send(data);
});

app.listen(app.get('port'), function() {                                                                                        console.log("Node app is running at localhost:" + app.get('port'))                                                             
})
