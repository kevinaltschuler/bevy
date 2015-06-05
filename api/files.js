/**
 * files.js
 *
 * file route functions
 *
 * @author albert
 */

'use strict';

var shortid = require('shortid');
var fs = require('fs');
var gm = require('gm');

//var gfs = require('./../gridfs')();
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var gfs = Grid(mongoose.connection.db);

var IMAGE_TYPES = 'jpg jpeg gif png jpe bmp';

// GET /files/upload
// POST /files
exports.upload = function(req, res, next) {
	//var gfs = require('./../gridfs');
	//console.log(gfs);

	//console.log('start upload...');
	//console.log(req.files);
	var is, os;
	var id = shortid.generate();

	var extension = req.files.file.extension;
	extension = extension.toLowerCase();

	// TODO: more supported extensions
	if(IMAGE_TYPES.indexOf(extension) == -1) {
		// not supported
		return res.status(415).send('Supported image formats: jpeg, jpg, jpe, png, bmp');
	}

	// start upload
	is = fs.createReadStream(req.files.file.path);
	os = gfs.createWriteStream({ filename: id + '.' + extension });
	is.pipe(os);

	//handle error
	is.on('error', function() {
		return res.status(500).send('Something went wrong');
	});

	os.on('close', function (file) {
		//delete file from temp folder
		fs.unlink(req.files.file.path, function() {
			//console.log(file);
			res.status(200).json(file);
		});
	});

}

// GET /files/:fileid
exports.retrieve = function(req, res, next) {
	var fileid = req.params.fileid;

	var width = req.query['w'];
	var height = req.query['h'];

	var readstream = gfs.createReadStream({
		filename: fileid
	});

	req.on('error', function(err) {
		next(err);
	});
	readstream.on('error', function (err) {
		next(err);
	});


	if(width && height) {
		// resize
		gm(readstream)
			.resize(width, height, '^')
			.gravity('Center')
			.crop(width, height)
			.stream(function(err, stdout, stderr) {
				if(err) return next(err);
				stdout.pipe(res);
			});
	} else {
		readstream.pipe(res);
	}
}

// GET /files/:filename/remove
// DELETE /files/:filename
exports.remove = function(req, res, next) {
	var filename = req.params.filename;

	var options = { filename: filename };

	gfs.remove(options, function(err) {
		if(err) return next(err);
		return res.json(filename);
	});
}
