/**
 * bevies.js
 * API for bevies
 * @author albert
 * @flow
 */

'use strict';

// imports
var mongoose = require('mongoose');
var error = require('./../error');
var _ = require('underscore');
var shortid = require('shortid');
var async = require('async');
var getSlug = require('speakingurl');

var User = require('./../models/User');
var Bevy = require('./../models/Bevy');
var Thread = require('./../models/Thread');
var Message = require('./../models/Message');
var Post = require('./../models/Post');
var Board = require('./../models/Board');

var userPopFields = '_id displayName email image username '
 + 'google.displayName facebook.displayName';

// GET /users/:userid/bevies
exports.getUserBevies = function(req, res, next) {
  var user_id = req.params.userid;
  User.findOne({ _id: user_id }, function(err, user) {
    if(err) return next(err);
    if(_.isEmpty(user)) return ('User not found');
    Bevy.find({ _id: { $in: user.bevies } }, function(err, bevies) {
      if(err) return next(err);
      return res.json(bevies);
    })
    .populate({
      path: 'admins',
      select: userPopFields
    });
  });
};

//GET /bevies
exports.getPublicBevies = function(req, res, next) {
  Bevy.find(function(err, bevies) {
    if(err) return next(err);
    return res.json(bevies);
  })
  .populate({
    path: 'admins',
    select: userPopFields
  })
  .limit(20);
}

// POST /bevies
exports.createBevy = function(req, res, next) {
  var update = {};
  update._id = shortid.generate();
  if(req.body['name'] != undefined)
    update.name = req.body['name'];
  if(req.body['image'] != undefined)
    update.image = req.body['image'];
  if(req.body['admins'] != undefined)
    update.admins = req.body['admins'];
  if(req.body['settings'] != undefined)
    update.settings = req.body['settings'];

  if(!update.name) throw error.gen('bevy name not specified', req);

  if(req.body['slug'] != undefined)
    update.slug = req.body['slug'];
  else
    update.slug = getSlug(update.name);

  update.subCount = 1;

  async.waterfall([
    // first create the bevy
    function(done) {
      Bevy.create(update, function(err, bevy) {
        if(err) return done(err);
        return done(null, bevy);
      });
    },
    // then add bevy to first admin's bevy collection
    function(bevy, done) {
      User.findOne({ _id: update.admins[0] }, function(err, user) {
        if(err) return done(err);
        user.bevies.push(bevy._id);
        user.save(function(err) {
          if(err) return done(err);
          return done(null, bevy);
        });
      });
    }
  ], function(err, bevy) {
    if(err) return next(err);
    return res.json(bevy);
  });
}

// GET /bevies/:bevyid
exports.getBevy = function(req, res, next) {
  var bevy_id_or_slug = req.params.bevyid;

  Bevy.findOne({ $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]}, function(err, bevy) {
    if(err) return next(err);
    return res.json(bevy);
  }).populate({
    path: 'admins',
    select: userPopFields
  });
}

// GET /bevies/search/:query
exports.searchBevies = function(req, res, next) {
  var query = req.params.query;
  var promise = Bevy.find()
    .limit(20)
    .or([
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ])
    .exec();
  promise.then(function(bevies) {
    return res.json(bevies);
  }, function(err) {
    return next(err);
  });
}

// PUT/PATCH /bevies/:bevyid
exports.updateBevy = function(req, res, next) {
  var bevy_id_or_slug = req.params.bevyid;

  var update = {};
  if(req.body['name'] != undefined)
    update.name = req.body['name'];
  if(req.body['image'] != undefined)
    update.image = req.body['image'];
  if(req.body['admins'] != undefined)
    update.admins = req.body['admins'];
  if(req.body['boards'] != undefined)
    update.boards = req.body['boards'];
  if(req.body['settings'] != undefined)
    update.settings = req.body['settings'];

  if(req.body['slug'] != undefined)
    update.slug = req.body['slug'];
  else
    update.slug = getSlug(update.name);

  var query = { $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]};
  var promise = Bevy.findOneAndUpdate(query, update, { new: true })
    .populate({
      path: 'admins',
      select: userPopFields
    })
    .exec();
  promise.then(function(bevy) {
    if(!bevy) return next('Bevy not found');
    return bevy;
  }).then(function(bevy) {
    return res.json(bevy);
  }, function(err) { next(err); });
}

// PUT/PATCH /bevies/:bevyid/boards
exports.addBoard = function(req, res, next) {
  var bevy_id_or_slug = req.params.bevyid;

  if(req.body['board'] != undefined)
    var board = req.body['board'];

  Bevy.findOne({ $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]}, function(err, bevy) {
    if(err) return next(err);
    if(!bevy) return next('bevy not found');
    // push the new board
    bevy.boards.push(board);
    // save to database
    bevy.save(function(err, $bevy) {
      if(err) return next(err);
      return res.json($bevy);
    });
  });
}

// DELETE /bevies/:bevyid
exports.destroyBevy = function(req, res, next) {
  var bevy_id = req.params.bevyid;

  async.waterfall([
    // delete all boards directly related to this bevy
    function(done) {
      Board.remove({ parent: bevy_id }, function(err, boards) {
        if(err) return done(err);
        return done(null, boards);
      });
    },
    // remove all posts posted to those boards
    function(boards, done) {
      Post.remove({ board: { $in: _.pluck(boards, '_id') }}, function(err, posts) {
        if(err) return done(err);
        return done(null, boards);
      });
    },
    // remove board refs from all bevies with those boards in their collection
    function(boards, done) {
      async.each(boards, function(board, callback) {
        Bevy.find({ boards: board._id }, function(err, bevies) {
          if(err) return callback(err);
          async.each(bevies, function(bevy, $callback) {
            bevy.boards.pull(board._id);
            bevy.save(function(err) {
              if(err) return $callback(err);
              return $callback(null);
            });
          }, function(err) {
            if(err) return callback(err);
            return callback(null);
          });
        });
      }, function(err) {
        if(err) return done(err);
        return done(null, boards);
      });
    },
    // remove board refs from all users with those boards in their collection
    function(boards, done) {
      async.each(boards, function(board, callback) {
        User.find({ boards: board._id }, function(err, users) {
          if(err) return callback(err);
          async.each(users, function(user, $callback) {
            user.boards.pull(board._id);
            user.save(function(err) {
              if(err) return $callback(err);
              return $callback(null);
            });
          }, function(err) {
            if(err) return callback(err);
            return callback(null);
          });
        });
      }, function(err) {
        if(err) return done(err);
        return done(null);
      });
    },
    // remove all refs to this bevy from users subbed to it
    function(done) {
      User.find({ bevies: bevy_id }, function(err, users) {
        async.each(users, function(user, callback) {
          user.bevies.pull(bevy_id);
          user.save(function(err) {
            if(err) return callback(err);
            return callback(null);
          });
        }, function(err) {
          if(err) return done(err);
          return done(null);
        });
      });
    },
    // finally, remove the bevy from the database
    function(done) {
      Bevy.findOneAndRemove({ _id: bevy_id }, function(err, bevy) {
        if(err) return next(err);
        if(_.isEmpty(bevy)) return next('Bevy not found');
        done(null, bevy);
      });
    }
  ], function(err, bevy) {
    if(err) return next(err);
    return res.json(bevy);
  });
};


// GET /bevies/:slug/verify
exports.verifySlug = function(req, res, next) {
  var slug = req.params.slug;

  Bevy.findOne({ slug: slug }, function(err, bevy) {
    if(err) return next(err);
    if(_.isEmpty(bevy)) return res.json({ found: false }); // no bevy with that slug exists
    else return res.json({ found: true }); // matched a bevy. cant use that slug
  });
};
