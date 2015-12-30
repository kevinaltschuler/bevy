/**
 * controllers/notifications/index.js
 * create zmq listeners for server events and create notifications
 * @author albert
 * @flow
 */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function() {
	fs.readdirSync('./controllers/notifications').forEach(function(file) {
		// Avoid to read this current file.
		if(file === path.basename(__filename)) return;
		// Load the route file.
		require('./' + file);
  });
};
