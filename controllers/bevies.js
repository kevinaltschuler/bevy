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
      select: 'displayName username email image'
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
    select: 'displayName username email image'
  })
  .limit(20);
}

// POST /bevies
exports.createBevy = function(req, res, next) {
  var update = {};
  update._id = shortid.generate();
  if(req.body['name'] != undefined) 
    update.name = req.body['name'];
  if(req.body['description'] != undefined)
    update.description = req.body['description'];
  if(req.body['image'] != undefined) 
    update.image = req.body['image'];
  if(req.body['admins'] != undefined)
    update.admins = req.body['admins'];

  if(!update.name) throw error.gen('bevy name not specified', req);

  if(req.body['slug'] != undefined)
    update.slug = req.body['slug'];
  else
    update.slug = getSlug(update.name);

  Bevy.create(update, function(err, bevy) {
    if(err) return next(err);
    // create chat thread
    Thread.create({ bevy: bevy._id }, function(err, thread) {
      if(err) return next(err);
    });
    return res.json(bevy);
  });
}

// SHOW
// GET /bevies/:bevyid
exports.getBevy = function(req, res, next) {
  var bevy_id_or_slug = req.params.bevyid;

  Bevy.findOne({ $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]}, function(err, bevy) {
    if(err) return next(err);
    return res.json(bevy);
  }).populate({
    path: 'admins',
    select: 'displayName username email image'
  });
}

// SEARCH
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
  update._id = shortid.generate();
  if(req.body['name'] != undefined)
    update.name = req.body['name'];
  if(req.body['description'] != undefined)
    update.description = req.body['description'];
  if(req.body['image'] != undefined)
    update.image = req.body['image'];
  if(req.body['admins'] != undefined)
    update.admins = req.body['admins'];
  if(req.body['boards'] != undefined)
    update.boards = req.body['boards'];

  if(req.body['slug'] != undefined)
    update.slug = req.body['slug'];
  else
    update.slug = getSlug(update.name);

  if(req.body['settings']) {
    update.settings = req.body['settings'];
    if(update.settings.group_chat) {
      // group chat was enabled, create thread
      // use update func so we dont create one if it already exists
      Thread.update({ bevy: bevy_id }, { bevy: bevy_id }, { upsert: true }, function(err, thread) {
      });
    } else {
      // group chat was disabled, destroy thread
      Thread.findOneAndRemove({ bevy: bevy_id }, function(err, thread) {
      });
    }
  }

  var query = { $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]};
  var promise = Bevy.findOneAndUpdate(query, update, { new: true })
    .populate({
      path: 'admins',
      select: 'displayName username email image'
    })
    .exec();
  promise.then(function(bevy) {
    if(!bevy) throw error.gen('bevy not found', req);
    return bevy;
  }).then(function(bevy) {
    res.json(bevy);
  }, function(err) { next(err); });
}

// AddBoard
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
      console.log('board add success');
      return res.json($bevy);
    });
  });
}

// DESTROY
// DELETE /bevies/:bevyid
exports.destroyBevy = function(req, res, next) {
  var bevy_id_or_slug = req.params.bevyid;

  var query = { $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]};
  var promise = Bevy.findOneAndRemove(query)
    .exec();
  promise.then(function(bevy) {
    // delete the thread for this bevy
    Thread.findOneAndRemove({ bevy: bevy_id }, function(err, thread) {
      // and delete all messages in that thread
      Message.remove({ thread: thread._id }, function(err, messages) {});
    });
    // delete all posts posted to this bevy
    Post.remove({ bevy: bevy_id }, function(err, posts) {});
    // remove the reference to the bevy in all user's subscribed bevies
    User.find({ bevies: bevy_id }, function(err, users) {
      async.each(users, function(user, callback) {
        user.bevies.pull(bevy_id);
        user.save(function(err) {
          if(err) next(err);
        });
        callback();
      },
      function(err) {
        if(err) return next(err);
      });
    });

    return res.json(bevy);
  }, function(err) { next(err); })
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
