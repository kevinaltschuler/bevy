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
var async = require('async');

//var gfs = require('./../gridfs')();
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var gfs = Grid(mongoose.connection.db);

var IMAGE_TYPES = 'jpg jpeg gif png jpe bmp';

// GET /files/upload
// POST /files
exports.createFile = function(req, res, next) {
  var is, $is, os;
  var id = shortid.generate();

  // get file extension to filter for images
  var extension = req.files.file.extension;
  extension = extension.toLowerCase();
  // TODO: more supported extensions
  if(IMAGE_TYPES.indexOf(extension) == -1) {
    // not supported
    return res.status(415).send('Supported image formats: jpeg, jpg, jpe, png, bmp');
  }

  // start upload

  // jenk solution - gm plugin doesn't support asynchronous piping
  // so we need to create to input streams
  // one for gm to process image data (is => gm)
  // and one to send to gridfs ($is => os)
  is = fs.createReadStream(req.files.file.path);
  $is = fs.createReadStream(req.files.file.path);
  os = gfs.createWriteStream({ filename: id + '.' + extension });

  // object to send back to client
  var output_file = {};
  // start a bunch of async tasks
  async.waterfall([
    function(callback) {
      // get important data about image
      // using graphicsmagick identify
      gm(is)
      .identify(function(err, data) {
        if(err) return res.status(500).send('GM Identify Failed');
        // write gm-related metadata to output
        output_file.format = data.format;
        output_file.geometry = data.size;
        output_file.filesize = data.Filesize;

        callback(null);
      });
    },
    function(callback) {
      // pipe to gridfs
      $is.pipe(os);
      // once it finishes writing to gridfs...
      os.on('close', function (file) {
        // and once it deletes the file from temp folder...
        fs.unlink(req.files.file.path, function(err) {
          if(err) return res.status(500).send('File Failed to Unlink');
          // complete
          callback(null, file);
        });
      });
    }
  ], function(err, file) {
    // write gridfs-related metadata to output
    output_file._id = file._id;
    output_file.filename = file.filename;
    output_file.length = file.length;
    // send to client
    return res.status(200).json(output_file);
  });
}

// GET /files/:fileid
exports.getFile = function(req, res, next) {
  var fileid = req.params.fileid;

  var width = req.query['w'];
  var height = req.query['h'];

  var readstream = gfs.createReadStream({
    filename: fileid
  });

  req.on('error', function(err) {
    return next(err);
  });
  readstream.on('error', function (err) {
    return next(err);
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
exports.removeFile = function(req, res, next) {
  var filename = req.params.filename;

  var options = { filename: filename };

  gfs.remove(options, function(err) {
    if(err) return next(err);
    return res.json(filename);
  });
}
