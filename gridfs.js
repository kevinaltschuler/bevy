/**
 * gridfs.js
 *
 * @author albert
 */

'use strict';

var mongoose = require('mongoose');
var Grid = require('gridfs-stream');

var connected = false;

var gfs;

Grid.mongo = mongoose.mongo;

//gfs = Grid(mongoose.connection.db, mongoose.mongo);

mongoose.connection.on('open', function() {
	gfs = Grid(mongoose.connection.db);
	console.log('gridfs connected');
	connected = true
});

//exports.gfs = Grid(mongoose.connection.db);
//module.exports = Grid(mongoose.connection.db);

//module.exports = (mongoose.connection.readyState == 1) ? gfs : {};

module.exports = function() {
	return (connected) ? gfs : {};
};


