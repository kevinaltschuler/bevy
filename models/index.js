'use strict';

module.exports = function() {

	fs.readdirSync('./models').forEach(function(file) {
		// Avoid to read this current file.
		if (file === path.basename(__filename)) {
			return;
		}
		// Load the model and into mongoose
		var model = require('./' + file);
		mongoose.model(file, model);
  });

};
