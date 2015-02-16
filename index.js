var express = require('express');
var fs = require('fs');
var db = require('full-text-search-light');

// Create web server
var app = express();
app.set('port', (process.env.PORT || 5000));

// Create full text search for snippets
var snippetDb = new db('snippets');
snippetDb.init();

// Load snippets
var snippets = {};

var snippetFiles = fs.readdirSync("./snippets");
snippetFiles.forEach(function(fil) {
    var snippets = JSON.parse(fs.readFileSync("./snippets/" + fil));
    snippets.forEach(function(snip) {
        var id = snippetDb.add(snip);

        snip.id = id;
        snippets[id] = snip;
    });
});

app.get('/snippets', function(request, response) {
    response.send(snippetDb.search(request.query.query));
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
