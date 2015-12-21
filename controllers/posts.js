/**
 * posts.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var error = require('./../error');
var _ = require('underscore');
var async = require('async');
var og = require('open-graph');
var http = require('http');
var shortid = require('shortid');

var notifications = require('./notifications');

var User = require('./../models/User');
var Post = require('./../models/Post');
var Bevy = require('./../models/Bevy');
var Comment = require('./../models/Comment');

// INDEX
// GET /bevies/:bevyid/posts
exports.getBevyPosts = function(req, res, next) {
  var bevy_id = req.params.bevyid;

  var promise = Post.find({ bevy: bevy_id }, function(err, posts) {
    if(err) return next(err);
    if(posts.length <= 0) return res.json(posts);

    var _posts = [];
    posts.forEach(function(post) {
      var comment_promise = Comment.find({ postId: post._id })
        .populate('author')
        .exec();
      comment_promise.then(function(comments) {
        post = post.toJSON();
        post.comments = comments;
        _posts.push(post);
        if(_posts.length == posts.length) return res.json(_posts);
      }, function(err) { return next(err) });
    });

  }).populate('bevy author');
}

// CREATE
// POST /bevies/:bevyid/posts
exports.createPost = function(req, res, next) {
  var update = collectPostParams(req);
  update._id = shortid.generate();
  update.title = req.body['title'];
  update.tags = req.body['tags'];
  update.images = req.body['images'];
  update.author = req.body['author'];
  update.bevy = req.body['bevy'];
  update.expires = req.body['expires'];
  update.type = req.body['type'];
  update.event = req.body['event'];
  update.tag = req.body['tag'];

  if(_.isEmpty(update.bevy)) return next('no bevy');
  if(_.isEmpty(update.author)) return next('no author');
  if(_.isEmpty(update.type)) return next('no type');

  async.waterfall([
    function(done) {
      populateLinks(update, done);
    },
    function($update, done) {
      Post.create($update, function(err, post) {
        if(err) return next(err);
        // populate bevy
        Post.populate(post, { path: 'bevy author' }, function(err, pop_post) {
          // create notification
          notifications.make('post:create', { post: pop_post });

          return res.json(pop_post);
        });
      });
    }
  ]);
}

// SHOW
// GET /bevies/:bevyid/posts/:id
exports.getPost = function(req, res, next) {
  var id = req.params.id;

  Post.findOne({ _id: id }, function(err, post) {
    if(err) return next(err);
    if(_.isEmpty(post)) return next('Post not found');
    Comment.find({ postId: post._id }, function(err, comments) {
      if(err) return next(err);
      post = JSON.parse(JSON.stringify(post));
      post.comments = comments;
      return res.json(post);
    }).populate('author');
  }).populate('bevy author');
};

// UPDATE
// PUT/PATCH /bevies/:bevyid/posts/:id
exports.updatePost = function(req, res, next) {
  var id = req.params.id;
  var update = collectPostParams(req);
  if(req.body['pinned'] != undefined) {
    update.pinned = req.body['pinned'];
  }
  if(req.body['event'] != undefined)
    update.event = req.body['event'];

  async.waterfall([
    function(done) {
      populateLinks(update, done);
    },
    function($update, done) {
      var query = { _id: id };
      var promise = Post.findOneAndUpdate(query, $update, { new: true, upsert: true })
        .populate('bevy author')
        .exec();
      promise.then(function(post) {
        if(!post) throw error.gen('post not found');
        return post;
      }).then(function(post) {
        var _promise = Comment.find({ postId: post._id })
          .populate('author')
          .exec();
        _promise.then(function(comments) {
          post = post.toObject();
          post.comments = comments;
          return res.send(post);
        }, function(err) { return next(err) });
      }, function(err) { next(err); });
    }
  ]);
}

// DESTROY
// DELETE /bevies/:bevyid/posts/:id
exports.destroyPost = function(req, res, next) {
  var id = req.params.id;

  var query = { _id: id };
  var promise = Post.findOneAndRemove(query)
    .populate('bevy author')
    .exec();
  promise.then(function(post) {
    if(!post) throw error.gen('post not found');
    return post;
  }).then(function(post) {

    var _promise = Comment.find({ postId: post._id })
      .populate('author')
      .exec();
    _promise.then(function(comments) {
      post = post.toObject();
      post.comments = comments;
      return res.send(post);
    }, function(err) { return next(err) });

  }, function(err) { next(err); });
}

// get posts by this user
// GET /users/:userid/posts
exports.getUserPosts = function(req, res, next) {
  var user_id = req.params.userid;

  Post.find({ author: user_id }, function(err, posts) {
    if(err) return next(err);
    if(posts.length <= 0) return res.json(posts);
    var _posts = [];
    posts.forEach(function(post) {
      Comment.find({ postId: post._id }, function(err, comments) {
        if(err) return next(err);
        post = post.toObject();
        post.comments = comments;
        _posts.push(post);
        if(_posts.length == posts.length) return res.json(_posts);
      }).populate('author');
    });
  }).populate('bevy author');
}

// SEARCH
// GET /users/:userid/posts/search/:query
exports.searchPosts = function(req, res, next) {
  return res.json([]);
}

function populateLinks(post, done) {
  var title = post.title;
  if(_.isEmpty(title)) return done(null, post);
  var links = title.match(urlRegex);
  var $links = [];
  if(!_.isEmpty(links)) {
    links.forEach(function(link) {
      getMeta(link, function(meta) {
        if(_.isEmpty(meta)) {
          $links.push({
            url: link
          });
        } else {
          $links.push(meta);
        }
        if($links.length == links.length) {
          // add links
          //post.links = $links;
          // add images
          var images = post.images || [];
          post.images = addImages($links, images);

          done(null, post);
        }
      });
    });
  } else {
    done(null, post);
  }
}

function addImages(links, images) {
  links.forEach(function(link) {
    // does it have an image field?
    if(!_.isEmpty(link.image)) {
      // is it an array?
      if(_.isArray(link.image.url)) {
        link.image.url.forEach(function(url, index) {
          // see if it already exists
          if(images.indexOf(url) > -1) return;
          if(index == 0) return; // dont get the title image
          images.push(url);
        });
      } else {
        // see if it already exists
        if(images.indexOf(link.image.url) > -1) return;
        images.push(link.image.url);
      }
    }
  });
  return images;
}

var imageContentTypes = 'image/png image/gif image/jpg image/jpeg image/bmp'.split(' ');
var youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

var urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
var urlPartsRegex = /(.*:)\/\/([A-Za-z0-9\-\.]+)(:[0-9]+)?(.+)/i;

function getMeta(link, callback) {

  var url = link.match(urlPartsRegex);
  var host = url[2];
  var path = url[4];

  var youtubeUrls = 'www.youtube.com youtube.com youtu.be www.youtu.be'.split(' ');
  // lets not process videos
  if(youtubeUrls.indexOf(host) > -1) {
    callback({
      url: link
    });
  }

  // first try opengraph
  og(link, function(err, meta) {
    if(err || _.isEmpty(meta)) {
      // open graph didn't work, send a HEAD request

      var options = { method:'HEAD', host:host, port:'80', path:path };
      var req = http.request(options, function(res) {
        var headers = res.headers;
        var content_type = headers['content-type'];
        if(imageContentTypes.indexOf(content_type) > -1) {
          // its an image!
          callback({
            url: link,
            image: {
              url: link
            }
          });
        } else {
          // it's just a link!
          callback({
            url: link
          });
        }

      });
      req.end();
    } else {
      // return the opengraph meta
      callback(meta);
    }
  });
}
