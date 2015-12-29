'use strict';

var program = require('commander');
var mongoose = require('mongoose');
var gm = require('gm');
var async = require('async');
var fs = require('fs');
var Grid = require('gridfs-stream');
var _ = require('underscore');
var config = require('./config');
require('./models');
var gfs;

console.log('loaded dependencies');

mongoose.connect(config.database.URL);
var connection = mongoose.connection;

connection.once('open', function() {
  console.log('connected to database');

  Grid.mongo = mongoose.mongo;
  gfs = Grid(mongoose.connection.db);
  console.log('gridfs connected');

  program
    .version('0.0.1')
    .option('-m, --model [type]', 'Update a database model')
    .parse(process.argv);

  switch(program.model) {
    case 'posts':
    case 'post':
      updatePosts();
      break;
    case 'bevy':
    case 'bevies':
      updateBevies();
      break;
    case 'user':
    case 'users':
      updateUsers();
      break;
    case 'thread':
    case 'threads':
      updateThreads();
      break;
    case undefined:
      console.log('Empty model. PLease enter a valid model to update');
      process.exit();
      break;
    default:
      console.log(program.model + ' not defined. Please enter a valid model to update');
      process.exit();
      break;
  }
});

function updateThreads() {
  console.log('updating all threads...');
  var Thread = mongoose.model('Thread');
  Thread.find({}, function(err, threads) {
    async.eachLimit(threads, 50, function(thread, callback) {
      // if its already been updated, then return
      if(_.isObject(thread.image) && !_.isEmpty(thread.image)) {
        callback();
        return;
      }
      // if there hasn't been an image url set, then return
      if(_.isEmpty(thread.image_url) || typeof thread.image_url != 'string') {
        callback();
        return;
      }

      console.log('updating image for thread', thread._id);
      // if we're hosting the image
      if(thread.image_url.substr(7, 16) == 'api.joinbevy.com') {
        var image_id = thread.image_url.substr(30);
        var readstream = gfs.createReadStream({
          filename: image_id
        });
        var new_image = {};
        console.log('found valid image', image_id, 'updating...');

        // get the data for the new image object
        async.parallel([
          function($callback) {
            // get image metadata
            console.log('getting image metadata for', image_id);
            gm(readstream)
            .identify(function(err, data) {
              new_image.format = data.format;
              new_image.geometry = data.size;
              new_image.filesize = data.Filesize;
              $callback(null, '');
            });
          },
          function($callback) {
            // get image database meta
            console.log('getting image database metadata for', image_id);
            gfs.files.findOne({ filename: image_id }, function(err, file) {
              new_image._id = file._id;
              new_image.filename = file.filename;
              new_image.length = file.length;
              $callback(null, '');
            });
          }
        ], function(err, results) {
          console.log('success for', image_id, 'saving to server...');
          Thread.findOneAndUpdate({ _id: thread._id }, { image: new_image }, {}, 
          function(err, thread) {
            if(err) return err;
            console.log('updated thread', thread._id, 'successfully');
            callback();
          });
        });
      } else {
        // if we're not hosting it
        // then create a foreign image schema
        var new_image = {
          filename: thread.image_url,
          foreign: true
        };
        Thread.findOneAndUpdate({ _id: thread._id }, { image: new_image }, {}, 
        function(err, thread) {
          if(err) return err;
          console.log('updated thread', thread._id, 'successfully');
          callback();
        });
      }
    }, function(err) {
      if(err) return err;
      console.log('successfully updated all threads');
      process.exit();
    });
  }).lean();
};

function updateUsers() {
  console.log('updating all users...');
  var User = mongoose.model('User');
  User.find({}, function(err, users) {
    async.eachLimit(users, 50, function(user, callback) {
      // if its already been updated, then return
      if(_.isObject(user.image) && !_.isEmpty(user.image)) {
        callback();
        return;
      }
      // if there hasn't been an image url set, then return
      if(_.isEmpty(user.image_url) || typeof user.image_url != 'string') {
        callback();
        return;
      }

      console.log('updating image for user', user._id);
      // if we're hosting the image
      if(user.image_url.substr(7, 16) == 'api.joinbevy.com') {
        var image_id = user.image_url.substr(30);
        var readstream = gfs.createReadStream({
          filename: image_id
        });
        var new_image = {};
        console.log('found valid image', image_id, 'updating...');

        // get the data for the new image object
        async.parallel([
          function($callback) {
            // get image metadata
            console.log('getting image metadata for', image_id);
            gm(readstream)
            .identify(function(err, data) {
              new_image.format = data.format;
              new_image.geometry = data.size;
              new_image.filesize = data.Filesize;
              $callback(null, '');
            });
          },
          function($callback) {
            // get image database meta
            console.log('getting image database metadata for', image_id);
            gfs.files.findOne({ filename: image_id }, function(err, file) {
              new_image._id = file._id;
              new_image.filename = file.filename;
              new_image.length = file.length;
              $callback(null, '');
            });
          }
        ], function(err, results) {
          console.log('success for', image_id, 'saving to server...');
          User.findOneAndUpdate({ _id: user._id }, { image: new_image }, {}, 
          function(err, user) {
            if(err) return err;
            console.log('updated user', user._id, 'successfully');
            callback();
          });
        });
      } else {
        // if we're not hosting it
        // then create a foreign image schema
        var new_image = {
          filename: user.image_url,
          foreign: true
        };
        User.findOneAndUpdate({ _id: user._id }, { image: new_image }, {}, 
        function(err, user) {
          if(err) return err;
          console.log('updated user', user._id, 'successfully');
          callback();
        });
      }
    }, function(err) {
      if(err) return err;
      console.log('successfully updated all users');
      process.exit();
    });
  }).lean();
};

function updateBevies() {
  console.log('updating all bevies...');
  var Bevy = mongoose.model('Bevy');
  Bevy.find({}, function(err, bevies) {
    async.eachLimit(bevies, 50, function(bevy, callback) {
      // if its already been updated, then return
      if(_.isObject(bevy.image) && !_.isEmpty(bevy.image)) {
        callback();
        return;
      }
      // if there hasn't been an image url set, then return
      if(_.isEmpty(bevy.image_url) || typeof bevy.image_url != 'string') {
        callback();
        return;
      }

      console.log('updating images for bevy', bevy._id);
      // if we're hosting the image
      if(bevy.image_url.substr(7, 16) == 'api.joinbevy.com') {
        var image_id = bevy.image_url.substr(30);
        var readstream = gfs.createReadStream({
          filename: image_id
        });
        var new_image = {};
        console.log('found valid image', image_id, 'updating...');

        // get the data for the new image object
        async.parallel([
          function($callback) {
            // get image metadata
            console.log('getting image metadata for', image_id);
            gm(readstream)
            .identify(function(err, data) {
              new_image.format = data.format;
              new_image.geometry = data.size;
              new_image.filesize = data.Filesize;
              $callback(null, '');
            });
          },
          function($callback) {
            // get image database meta
            console.log('getting image database metadata for', image_id);
            gfs.files.findOne({ filename: image_id }, function(err, file) {
              new_image._id = file._id;
              new_image.filename = file.filename;
              new_image.length = file.length;
              $callback(null, '');
            });
          }
        ], function(err, results) {
          console.log('success for', image_id, 'saving to server...');
          Bevy.findOneAndUpdate({ _id: bevy._id }, { image: new_image }, {}, 
          function(err, bevy) {
            if(err) return err;
            console.log('updated bevy', bevy._id, 'successfully');
            callback();
          });
        });
      } else {
        // if we're not hosting it
        // then create a foreign image schema
        var new_image = {
          filename: bevy.image_url,
          foreign: true
        };
        Bevy.findOneAndUpdate({ _id: bevy._id }, { image: new_image }, {}, 
        function(err, bevy) {
          if(err) return err;
          console.log('updated bevy', bevy._id, 'successfully');
          callback();
        });
      }
    }, function(err) {
      if(err) return err;
      console.log('all bevies updated successfully');
      process.exit();
    });
  }).lean();
};

function updatePosts() {
  // update posts
  console.log('updating all posts...');
  var Post = mongoose.model('Post');
  Post.find({}, function(err, posts) {
    // for all posts
    // limit how many threads are spawned to keep from overflowing
    async.eachLimit(posts, 50, function(post, callback) {
      var new_images = [];
      //var images = JSON.parse(JSON.stringify(post.images));
      var images = post.images;
      console.log('updating ' + images.length + ' images for post ' + post._id);
      async.each(images, function(image_url, $callback) {
        if(typeof image_url != 'string') {
          new_images.push(image_url);
          $callback();
          return;
        }
        
        if(image_url.substr(7, 16) == 'api.joinbevy.com') {
          // if we're hosting the image
          var image_id = image_url.substr(30);
          var readstream = gfs.createReadStream({
            filename: image_id
          });
          var new_image = {};

          console.log('found valid image', image_id, 'updating...');

          // get the data for the new image object
          async.parallel([
            function($$callback) {
              // get image metadata
              console.log('getting image metadata for', image_id);
              gm(readstream)
              .identify(function(err, data) {
                new_image.format = data.format;
                new_image.geometry = data.size;
                new_image.filesize = data.Filesize;
                $$callback(null, '');
              });
            },
            function($$callback) {
              // get image database meta
              console.log('getting image database metadata for', image_id);
              gfs.files.findOne({ filename: image_id }, function(err, file) {
                new_image._id = file._id;
                new_image.filename = file.filename;
                new_image.length = file.length;
                $$callback(null, '');
              });
            }
          ], function(err, results) {
            console.log('success for', image_id);
            new_images.push(new_image);
            $callback();
          });
        } else {
          // its hosted somewhere else
          // create a foreign image schema
          var new_image = {
            filename: image_url,
            foreign: true
          };
          new_images.push(new_image);
          $callback();
        }
      }, function(err) {
        if(err) {
          console.error('IMAGE_URL PARSING ERROR');
          return;
        }
        // once all the new image are populated
        // save the new post model
        Post.findOneAndUpdate({ _id: post._id }, { images: new_images }, {}, 
        function(err, $post) {
          if(err) return;
          console.log('all images for', post._id, 'updated successfully');
          callback();
        });
      });
    }, function(err) {
      if(err) {
        console.error('POST LOOPING ERROR');
        return;
      }
      console.log('all posts updated successfully');
      process.exit();
    });
  }).lean();
};