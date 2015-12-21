'use strict';

var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

fs.readdirSync('./models').forEach(function(file) {
	// Avoid to read this current file.
	if (file === path.basename(__filename)) {
		return;
	}
	// Load the schema
	var schema = require('./' + file);
	// generate file name (lop off .js)
	var schema_name = file.substring(0, file.length - 3);
	// load schema into mongoose
	//mongoose.model(schema_name, schema);
});
