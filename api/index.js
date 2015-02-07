'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(app) {

	fs.readdirSync('./api').forEach( function(file) {
		// Avoid to read this current file.
		if (file === path.basename(__filename)) {
			return;
		}
		// Load the route file.
		require('./' + file)(app);
  });

};
