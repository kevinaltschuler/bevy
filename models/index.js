'use strict';

//var mongoose = require('mongoose');
//var Schema = mongoose.Schema

var roles = 'user staff mentor investor founder'.split(' ');

module.exports = function() {

	fs.readdirSync('./models').forEach(function(file) {
		// Avoid to read this current file.
		if (file === path.basename(__filename)) {
			return;
		}
		// Load the route file.
		require('./' + file);
  });

};
