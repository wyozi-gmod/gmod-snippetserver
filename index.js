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
var snippetMap = {}; // ID->Snippet map
var allSnippetMeta = []; // Metadata of all snippets

// We don't want full text engine to index code
var snippetFilter = function(key, val) {
    if (key == 'code') {
        return false;
    }

    return true;
}

var snippetFiles = fs.readdirSync("./snippets");
snippetFiles.forEach(function(fil) {
    var snippets = JSON.parse(fs.readFileSync("./snippets/" + fil));
    snippets.forEach(function(snip) {
        var id = snippetDb.add(snip, snippetFilter);

        snip.id = id;
        snippetMap[id] = snip;

        allSnippetMeta.push({id: id, title: snip.title});
    });
});

app.get('/snippets/:snippet', function(request, response) {
    var id = parseInt(request.param("snippet") || -1);
    var snippet = snippetMap[id];
    response.send(snippet);
});

app.get('/snippets', function(request, response) {
    var query = request.query.query;
    if (query) {
        var res = snippetDb.search(query).map(function(searchRes) {
            return {
                id: searchRes.id,
                title: searchRes.title,
                desc: searchRes.desc
            };
        });

        response.send(res);
    }
    else {
        response.send(allSnippetMeta);
    }
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
