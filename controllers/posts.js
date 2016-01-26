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
var mq = require('./../mq');
var config = require('./../config');

var notifications = require('./notifications');

var User = require('./../models/User');
var Post = require('./../models/Post');
var Bevy = require('./../models/Bevy');
var Comment = require('./../models/Comment');
var Board = require('./../models/Board');

var authorPopFields = '_id displayName email image username '
 + 'google facebook';
var boardPopFields = '_id name image settings parent';

// GET /boards/:boardid/posts
exports.getBoardPosts = function(req, res, next) {
  var board_id = req.params.boardid;
  Post.find({ board: board_id }, function(err, posts) {
    if(err) return next(err);
    if(posts.length <= 0) return res.json(posts);
    var _posts = [];
    posts.forEach(function(post) {
      post = JSON.parse(JSON.stringify(post));
      Comment.find({ postId: post._id }, function(err, comments) {
        if(err) return next(err);
        post.comments = comments;
        _posts.push(post);
        if(_posts.length == posts.length) return res.json(_posts);
      })
      .populate({
        path: 'author',
        select: authorPopFields
      });
    });
  })
  .populate({
    path: 'board',
    select: boardPopFields
  })
  .populate({
    path: 'author',
    select: authorPopFields
  });
};

// GET /bevies/:bevyid/posts
exports.getBevyPosts = function(req, res, next) {
  var bevy_id_or_slug = req.params.bevyid;
  Bevy.findOne({ $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]}, function(err, bevy) {
    if(err) return next(err);
    if(_.isEmpty(bevy))  {
      return res.json([]);
    }
    if(_.isEmpty(bevy.boards)) {
      return res.json([]);
    }
    Post.find({ board: { $in: bevy.boards }}, function(err, posts) {
      if(err) return next(err);
      if(posts.length <= 0) return res.json(posts);
      var _posts = [];
      posts.forEach(function(post) {
        post = JSON.parse(JSON.stringify(post));
        Comment.find({ postId: post._id }, function(err, comments) {
          if(err) return next(err);
          post.comments = comments;
          _posts.push(post);
          if(_posts.length == posts.length) return res.json(_posts);
        })
        .populate({
          path: 'author',
          select: authorPopFields
        });
      });
    })
    //.limit(10)
    .populate({
      path: 'board',
      select: boardPopFields
    })
    .populate({
      path: 'author',
      select: authorPopFields
    });
  });
};

// POST /posts
exports.createPost = function(req, res, next) {
  var update = {};
  update._id = shortid.generate();
  update.title = req.body['title'];
  update.images = req.body['images'];
  update.author = req.body['author'];
  update.board = req.body['board'];
  update.expires = req.body['expires'];
  update.type = req.body['type'];
  update.event = req.body['event'];

  if(_.isEmpty(update.board)) return next('no board');
  if(_.isEmpty(update.author)) return next('no author');
  if(_.isEmpty(update.type)) return next('no type');

  Post.create(update, function(err, post) {
    if(err) return next(err);
    // populate board
    Post.populate(post, [
      { path: 'author',
        select: authorPopFields },
      { path: 'board',
        select: boardPopFields }
    ], function(err, pop_post) {
      if(err) return next(err);
      // create notification
      mq.pubSock.send([config.mq.events.NEW_POST, JSON.stringify(pop_post)]);
      return res.json(pop_post);
    });
  });
}

// GET /posts/:postid
exports.getPost = function(req, res, next) {
  var post_id = req.params.postid;
  Post.findOne({ _id: post_id }, function(err, post) {
    if(err) return next(err);
    if(_.isEmpty(post)) return next('Post not found');
    post = JSON.parse(JSON.stringify(post));
    Comment.find({ postId: post_id }, function(err, comments) {
      if(err) return next(err);
      post.comments = comments;
      return res.json(post);
    })
    .populate({
      path: 'author',
      select: authorPopFields
    });
  })
  .populate({
    path: 'board',
    select: boardPopFields
  })
  .populate({
    path: 'author',
    select: authorPopFields
  });
};

// PUT/PATCH /posts/:postid
exports.updatePost = function(req, res, next) {
  var post_id = req.params.postid;
  var update = {};
  if(req.body['title'] != undefined)
    update.title = req.body['title']
  if(req.body['pinned'] != undefined)
    update.pinned = req.body['pinned'];
  if(req.body['event'] != undefined)
    update.event = req.body['event'];
  if(req.body['votes'] != undefined)
    update.votes = req.body['votes'];
  if(req.body['expires'] != undefined)
    update.expires = req.body['expires'];
  if(req.body['images'] != undefined)
    update.images = req.body['images'];
  if(req.body['edited'] != undefined)
    update.edited = req.body['edited'];

  var promise = Post.findOneAndUpdate({ _id: post_id }, update, { new: true })
  .populate({
    path: 'board',
    select: boardPopFields
  })
  .populate({
    path: 'author',
    select: authorPopFields
  })
  .exec();

  promise.then(function(post) {
    if(_.isEmpty(post)) return next('Post not found');
    post = JSON.parse(JSON.stringify(post));
    Comment.find({ postId: post_id }, function(err, comments) {
      if(err) return next(err);
      post.comments = comments;
      return res.json(post);
    })
    .populate({
      path: 'author',
      select: authorPopFields
    });
  }, function(err) {
    return next(err);
  });
}

// DELETE /posts/:postid
exports.destroyPost = function(req, res, next) {
  var post_id = req.params.postid;
  Post.findOneAndRemove({ _id: post_id }, function(err, post) {
    if(err) return next(err);
    if(_.isEmpty(post)) return next('Post not found');
    return res.json(post);
  })
  .populate({
    path: 'board',
    select: boardPopFields
  })
  .populate({
    path: 'author',
    select: authorPopFields
  });
}

// GET /users/:userid/posts
exports.getUserPosts = function(req, res, next) {
  var user_id = req.params.userid;

  Post.find({ author: user_id }, function(err, posts) {
    if(err) return next(err);
    if(posts.length <= 0) return res.json(posts);
    var _posts = [];
    posts.forEach(function(post) {
      post = JSON.parse(JSON.stringify(post));
      Comment.find({ postId: post._id }, function(err, comments) {
        if(err) return next(err);
        post.comments = comments;
        _posts.push(post);
        if(_posts.length == posts.length) return res.json(_posts);
      })
      .populate({
        path: 'author',
        select: authorPopFields
      });
    });
  })
  .populate({
    path: 'board',
    select: boardPopFields
  })
  .populate({
    path: 'author',
    select: authorPopFields
  });
}

// GET /posts/search/:query
exports.searchPosts = function(req, res, next) {
  var query = req.params.query;
  var board_id = (req.query['board_id'] == undefined) ? null : req.query['board_id'];
  var bevy_id = (req.query['bevy_id'] == undefined) ? null : req.query['bevy_id'];
  // if theres no query, return nothing
  if(_.isEmpty(query)) return res.json([]);

  var promise;
  promise = Post.find()
    .limit(10)
    .or([
      { title: { $regex: query, $options: 'i' }},
      { 'event.description': { $regex: query, $options: 'i' }}
    ]);

  if(bevy_id) {
    Bevy.findOne({ _id: bevy_id }, function(err, bevy) {
      if(err) return next(err);
      if(!bevy) return next('Bevy not found');
      promise.where({ board: { $in: bevy.boards }});
      if(board_id) {
        promise.where({ board: board_id });
      }
      promise.exec();
    }).select('_id boards').lean();
  } else {
    if(board_id) {
      promise.where({ board: board_id });
    }
    promise.exec();
  }
  promise.then(function(posts) {
    return res.json(posts);
  }, function(err) {
    return next(err);
  });
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
    callback({ url: link });
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
            image: { url: link }
          });
        } else {
          // it's just a link!
          callback({ url: link });
        }
      });
      req.end();
    } else {
      // return the opengraph meta
      callback(meta);
    }
  });
}
