var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/snippets/:query', function(request, response) {
    response.send({
        responses: [
            { val: "Hello" },
            { val: "World" }
        ]
    });
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
