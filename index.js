var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

var db = require('full-text-search-light');
var snippetDb = new db('snippets');
snippetDb.init();

// Load snippets
var snippetExports = require('require-dir')('./snippets');
var snippets = {};

for (var nm in snippetExports) {
    var ex = snippetExports[nm];

    if (!ex.snippets) {
        continue;
    }

    ex.snippets.forEach(function(snip) {
        var id = snippetDb.add(snip);

        snip.id = id;
        snippets[id] = snip;
    });
}

app.get('/snippets', function(request, response) {
    response.send(snippetDb.search(request.query.query));
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
