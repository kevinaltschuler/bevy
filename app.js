var config = require('./config.js');

var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.send('Hello World!');
});

var server = app.listen(config.server.port, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port)
})
