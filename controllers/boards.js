/**
 * boards.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');
var shortid = require('shortid');
var async = require('async');

var Board = require('./../models/Board');
var Bevy = require('./../models/Bevy');
var User = require('./../models/User');
var Post = require('./../models/Post');

var userPopFields = '_id displayName email image username '
 + 'google facebook created';
var bevyPopFields = '_id name slug image settings admins created';

// GET /users/:userid/boards
exports.getUserBoards = function(req, res, next) {
  var user_id = req.params.userid;

  User.findOne({ _id: user_id }, function(err, user) {
    if(err) return next(err);
    if(_.isEmpty(user)) return next('User not found');
    Board.find({ _id: { $in: user.boards }}, function(err, boards) {
      if(err) return next(err);
      return res.json(boards);
    })
    .populate({
      path: 'admins',
      select: userPopFields
    });
  });
};

// GET /bevies/:bevyid/boards
exports.getBevyBoards = function(req, res, next) {
  var bevy_id_or_slug = req.params.bevyid;

  Bevy.findOne({ $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]}, function(err, bevy) {
    if(err) return next(err);
    if(_.isEmpty(bevy)) return next({
      code: 404,
      message: 'Bevy not found'
    });
    Board.find({ parent: bevy._id }, function(err, boards) {
      if(err) return next(err);
      return res.json(boards);
    })
    .populate({
      path: 'admins',
      select: userPopFields
    });
  });


  /*.populate({
    path: 'parents',
    select: '_id name slug image'
  });*/
};

// POST /boards
exports.createBoard = function(req, res, next) {
  // verify required fields
  if(req.body['name'] == undefined) return next('Board name not defined');
  if(req.body['parent'] == undefined) return next("Board's parent not defined");
  if(req.body['type'] == undefined) return next('Board type not defined');
  if(req.body['admins'] == undefined) return next("Board's initial admins not defined");

  var update = {};
  update._id = shortid.generate();
  update.name = req.body['name'];
  update.parent = req.body['parent'];
  update.admins = req.body['admins'];
  update.type = req.body['type'];

  // optional fields
  if(req.body['description'] != undefined)
    update.description = req.body['description'];
  if(req.body['image'] != undefined)
    update.image = req.body['image'];
  if(req.body['settings'] != undefined)
    update.settings = req.body['settings'];

  // automatically set subcount to 1
  update.subCount = 1;

  async.waterfall([
    function(done) {
      Board.create(update, function(err, board) {
        if(err) return done(err);
        done(null, board);
      });
    },
    // add board to parent bevy's collection of boards
    function(board, done) {
      Bevy.findOne({ _id: update.parent }, function(err, bevy) {
        if(err) return done(err);
        if(_.isEmpty(bevy)) return done('Board parent bevy not found');
        bevy.boards.push(board._id);
        bevy.save(function(err) {
          if(err) return done(err);
          done(null, board);
        });
      });
    },
    // add board to all members of that bevy
    // TODO remove later when we implement board joining/leaving again
    function(board, done) {
      User.find({ bevies: board.parent }, function(err, users) {
        if(err) return done(err);
        users.forEach(function(user) {
          user.boards.push(board._id);
          user.save(function(err) {
            if(err) return done(err);
          })
        });
        done(null, board);
      });
    }
  ], function(err, board) {
    if(err) return next(err);
    return res.json(board);
  });
};

// GET /boards/:boardid
exports.getBoard = function(req, res, next) {
  var board_id = req.params.boardid;
  Board.findOne({ _id: board_id }, function(err, board) {
    if(err) return next(err);
    if(_.isEmpty(board)) return next('Board not found');
    return res.json(board);
  })
  .populate({
    path: 'parent',
    select: bevyPopFields
  })
  .populate({
    path: 'admins',
    select: userPopFields
  });
};

// PUT /boards/:boardid
// PATCH /boards/:boardid
exports.updateBoard = function(req, res, next) {
  var board_id = req.params.boardid;
  var update = {};
  if(req.body['name'] != undefined)
    update.name = req.body['name'];
  if(req.body['description'] != undefined)
    update.description = req.body['description'];
  if(req.body['type'] != undefined)
    update.type = req.body['type'];
  if(req.body['parents'] != undefined)
    update.parents = req.body['parents'];
  if(req.body['slug'] != undefined)
    update.slug = req.body['slug'];
  if(req.body['image'] != undefined)
    update.image = req.body['image'];
  if(req.body['admins'] != undefined)
    update.admins = req.body['admins'];
  if(!_.isEmpty(update)) {
    update.updated = Date.now();
  }

  if(req.body['settings']) {
    update.settings = req.body['settings'];
  }

  var promise = Board.findOneAndUpdate({ _id: board_id }, update, { new: true })
    /*.populate({
      path: 'parents',
      select: '_id name slug image'
    })*/
    .exec();
  promise.then(function(board) {
    if(_.isEmpty(board)) return next('Board not found');
    return res.json(board);
  }, function(err) {
    return next(err);
  });
};

// DELETE /boards/:boardid
exports.destroyBoard = function(req, res, next) {
  var board_id = req.params.boardid;
  async.waterfall([
    // first remove board from all bevies with that board in their collection
    function(done) {
      Bevy.find({ boards: board_id }, function(err, bevies) {
        if(err) return done(err);
        async.each(bevies, function(bevy, callback) {
          bevy.boards.pull(board_id);
          bevy.save(function(err) {
            if(err) return callback(err);
            callback(null);
          });
        }, function(err) {
          if(err) return done(err);
          return done(null);
        });
      });
    },
    // then remove board from all users with that board in their collection
    function(done) {
      User.find({ boards: board_id }, function(err, users) {
        if(err) return done(err);
        async.each(users, function(user, callback) {
          user.boards.pull(board_id);
          user.save(function(err) {
            if(err) return callback(err);
            callback(null);
          });
        }, function(err) {
          if(err) return done(err);
          return done(null);
        });
      });
    },
    // then remove all posts posted to that board
    function(done) {
      Post.find({ board: board_id }, function(err, posts) {
        if(err) return done(err);
        return done(null);
      });
    },
    // finally remove the board from the database
    function(done) {
      Board.findOneAndRemove({ _id: board_id }, function(err, board) {
        if(err) return done(err);
        return done(null, board);
      })
    }
  ], function(err, board) {
    if(err) return next(err);
    return res.json(board);
  });
};

// GET /boards/:boardid/subscribers
exports.getSubscribers = function(req, res, next) {
  var board_id = req.params.boardid;
  User.find({ boards: board_id }, function(err, users) {
    if(err) return next(err);
    return res.json(users);
  })
  .limit(20);
};
