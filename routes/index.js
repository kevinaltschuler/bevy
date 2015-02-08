'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(app) {

	fs.readdirSync('./routes').forEach(function(file) {
		// Avoid to read this current file.
		if (file === path.basename(__filename)) {
			return;
		}
		// Load the route file.
		require('./' + file)(app);
  });

	//404
	app.get('*', function(req, res) {
		res.status(404).send90;
	});

};
