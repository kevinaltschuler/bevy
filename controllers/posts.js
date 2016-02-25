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

var authorPopFields = '_id displayName email image username \
  google facebook created name title';
var boardPopFields = '_id name image settings parent created';

// GET /users/:userid/posts
var getUserPosts = function(req, res, next) {
  var user_id = req.params.userid;

  var promise = Post.find();
  promise.where({ author: user_id });

  promise = applyDateRange(req, promise);
  promise = applySort(req, promise);
  promise = applyPopulation(req, promise);

  promise.exec();
  promise.then(function(posts) {
    return returnPostsWithComments(req, res, next, posts);
  }, function(err) {
    if(err) return next(err);
  });
};
exports.getUserPosts = getUserPosts;

// GET /boards/:boardid/posts
var getBoardPosts = function(req, res, next) {
  var board_id = req.params.boardid;

  var promise = Post.find();
  promise.where({ board: board_id });

  promise = applyDateRange(req, promise);
  promise = applySort(req, promise);
  promise = applyPopulation(req, promise);

  promise.exec();
  promise.then(function(posts) {
    return returnPostsWithComments(req, res, next, posts);
  }, function(err) {
    if(err) return next(err);
  });
};
exports.getBoardPosts = getBoardPosts;

// GET /bevies/:bevyid/posts
var getBevyPosts = function(req, res, next) {
  var bevy_id_or_slug = req.params.bevyid;
  Bevy.findOne({ $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]}, function(err, bevy) {
    if(err) return next(err);
    if(_.isEmpty(bevy)) return res.json([]);
    if(_.isEmpty(bevy.boards)) return res.json([]);

    var promise = Post.find();
    promise.where({ board: { $in: bevy.boards }});

    promise = applyDateRange(req, promise);
    promise = applySort(req, promise);
    promise = applyPopulation(req, promise);

    promise.exec();
    promise.then(function(posts) {
      return returnPostsWithComments(req, res, next, posts);
    }, function(err) {
      return next(err);
    });
  });
};
exports.getBevyPosts = getBevyPosts;

// GET /posts/search/:query
var searchPosts = function(req, res, next) {
  var query = req.params.query;
  if(query == undefined)
    query = req.query['q'];

  var board_id = req.query['board_id'];
  var bevy_id = req.query['bevy_id'];
  var start_date = req.query['start_date'];
  var end_date = req.query['end_date'];
  var author_id = req.query['author_id'];

  var promise;
  promise = Post.find();
  promise.limit(10);

  if(!_.isEmpty(query)) {
    promise.where({ $or: [
      { title: { $regex: query, $options: 'i' }},
      { 'event.description': { $regex: query, $options: 'i' }}
    ]});
  }

  promise = applyDateRange(req, promise);
  promise = applySort(req, promise);
  promise = applyPopulation(req, promise);

  if(author_id != undefined) {
    promise.where({ author: author_id });
  }

  if(bevy_id != undefined) {
    Bevy.findOne({ _id: bevy_id }, function(err, bevy) {
      if(err) return next(err);
      if(!bevy) return next('Bevy not found');
      if(board_id != undefined) {
        promise.where({ board: board_id });
      } else {
        promise.where({ board: { $in: bevy.boards }});
      }
      promise.exec();
      promise.then(function(posts) {
        return returnPostsWithComments(req, res, next, posts);
      }, function(err) {
        return next(err);
      });
    }).select('_id boards').lean();
  } else {
    if(board_id != undefined) {
      promise.where({ board: board_id });
    }
    promise.exec();
    promise.then(function(posts) {
      return returnPostsWithComments(req, res, next, posts);
    }, function(err) {
      return next(err);
    });
  }
};
exports.searchPosts = searchPosts;

// POST /posts
exports.createPost = function(req, res, next) {
  var update = {};
  update._id = shortid.generate();
  update.title = req.body['title'];
  update.images = req.body['images'];
  update.author = req.body['author'];
  update.board = req.body['board'];
  update.bevy = req.body['bevy'];
  update.expires = req.body['expires'];
  update.type = req.body['type'];
  update.event = req.body['event'];

  if(update.board == undefined) return next('no board');
  if(update.bevy == undefined) return next('no bevy');
  if(update.author == undefined) return next('no author');
  if(update.type == undefined) return next('no type');

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

// apply date ranges to the post query
// can only accept these from req.query
// and can use start_date, end_date, or both
var applyDateRange = function(req, promise) {
  var start_date = req.query['start_date'];
  var end_date = req.query['end_date'];
  // date matching
  if (start_date != undefined) {
    promise.where({ created: { $gte: new Date(start_date)}});
  } else if (end_date != undefined) {
    promise.where({ created: { $lte: new Date(end_date)}});
  }
  return promise;
};

// apply sorting to the post query
var applySort = function(req, promise) {
  var sort = req.query['sort'];
  if(sort != undefined) {
    switch(sort) {
      case 'new':
        promise.sort({ created: -1 });
        break;
      case 'top':
        promise.sort({ score: -1 });
        break;
    }
  }
  return promise;
};

// apply population to the post query
// right now only populates the author and board fields
var applyPopulation = function(req, promise) {
  promise.populate({
    path: 'board',
    select: boardPopFields
  });
  promise.populate({
    path: 'author',
    select: authorPopFields
  });
  return promise;
};

// returns posts along with all comments that have been posted to it
// DOES NOT NEST THE COMMENTS. it's up to the front-end/client to do that
// expensive operation
var returnPostsWithComments = function(req, res, next, posts) {
  if(posts.length <= 0) return res.json(posts);
  async.forEachOf(posts, function(post, index, callback) {
    post = JSON.parse(JSON.stringify(post));
    Comment.find({ postId: post._id }, function(err, comments) {
      if(err) return callback(err);
      post.comments = comments;
      posts[index] = post;
      return callback(null);
    })
    .populate({
      path: 'author',
      select: authorPopFields
    });
  }, function(err) {
    if(err) return next(err);
    else return res.json(posts);
  });
};
