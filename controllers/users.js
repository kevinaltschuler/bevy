/**
 * users.js
 * API for users
 * @author albert
 */

'use strict';

var _ = require('underscore');
var error = require('./../error');
var bcrypt = require('bcryptjs');
var async = require('async');

var shortid = require('shortid')
var mailgun = require('./../config').mailgun();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./../models/User');
var Bevy = require('./../models/Bevy');
var Post = require('./../models/User');
var Notification = require('./../models/Notification');
// INDEX
// GET /users
exports.getUsers = function(req, res, next) {
  User.find({}, function(err, users) {
    if(err) return next(err);
    return res.json(users);
  }).limit(15);
};

// CREATE
// POST /users
exports.createUser = function(req, res, next) {
  // check for required fields
  if(_.isEmpty(req.body['username']))
    return next('Missing Identifier - Username');
  else if(_.isEmpty(req.body['password']))
    return next('Missing Verification - Password');
  else if (_.isEmpty(req.body['bevy']))
    return next('User not associated with a bevy');

  var update = {
    _id: shortid.generate(),
    username: req.body['username'],
    password: req.body['password'],
    bevy: req.body['bevy'],
    created: Date.now()
  }
  if(req.body['email'] != undefined)
    update.email = req.body['email'];
  if(req.body['phone'] != undefined)
    update.phone = req.body['phone'];

  // hash password if it exists
  update.password = bcrypt.hashSync(update.password, 8);

  User.create(update, function(err, user) {
    if(err) return next(err);
    // TODO: send a welcome email
    return res.json(user);
  });
}

// SHOW
// GET /users/:id/
exports.getUser = function(req, res, next) {
  var user_id_or_username = req.params.userid;
  var bevy_id = req.query['bevy_id'];
  // if a bevy var is requested with this user, then search for the user
  // via their username and their bevy
  // otherwise just search for the user from their ID
  var query = (bevy_id == undefined)
    ? { _id: user_id_or_username }
    : { $and: [{ username: user_id_or_username }, { bevy: bevy_id }]};

  User.findOne(query, function(err, user) {
    if(err) return next(err);
    if(!user) return next('User not found');
    return res.json(user);
  });
}

//SEARCH
//GET /users/search/:query
exports.searchUsers = function(req, res, next) {
	var query = req.params.query;
  var exclude_users = req.query['exclude'];
  var bevy_id = req.query['bevy_id'];
  var role = req.query['role'];

  var promise;
  if(_.isEmpty(query)) {
    promise = User.find()
  } else {
    promise = User.find()
      .or([
        { email: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } }
      ]);
  }
  if(exclude_users != undefined) {
    promise.where({ _id: { $not: { $in: exclude_users }}});
  }
  if(bevy_id != undefined) {
    promise.where({ bevy: bevy_id });
  }
  if(role != undefined) {
    // if we're searching through admins
    if(role == 'admin') {
      // expect the client to send us the list of admin ids to search through
      // we can fix this later but the client should have this list regardless
      var admin_ids = req.query['admin_ids'];
      // break out if admin ids not supplied
      if(admin_ids == undefined)
        return next('No admin IDs specified');
      // return empty array if id array is specified but is empty
      else if (admin_ids.length <= 0)
        return res.json([]);

      promise.where({ _id: { $in: admin_ids }});
    }
  }
  promise.exec();
  promise.then(function(users) {
    return res.json(users);
  }, function(err) {
    return next(err);
  });
}

// UPDATE
// PUT/PATCH /users/:id
exports.updateUser = function(req, res, next) {
  var id = req.params.id;

  var update = {};
  update.updated = new Date();
  if(req.body['bevy'] != undefined)
    update.bevies = req.body['bevies'];
  if(req.body['image'] != undefined)
    update.image = req.body['image'];
  if(req.body['boards'] != undefined)
    update.boards = req.body['boards'];
  if(req.body['name'] != undefined)
    update.name = req.body['name'];
  if(req.body['title'] != undefined)
    update.title = req.body['title'];
  if(req.body['phoneNumber'] != undefined)
    update.phoneNumber = req.body['phoneNumber'];

  var promise = User.findOneAndUpdate({ _id: id }, update, { new: true });
  promise.then(function(user) {
    return res.json(user);
  }, function(err) {
    return next(err);
  });
}

// AddBoard
// PUT/PATCH /users/:id/boards
exports.addBoard = function(req, res, next) {
  var id = req.params.id;

  if(req.body['board'] != undefined)
    var board = req.body['board'];

  User.findOne({ _id: id }, function(err, user) {
    if(err) return next(err);
    if(!user) return next('user not found');
    // push the new board
    user.boards.push(board);
    // save to database
    user.save(function(err, $user) {
      if(err) return next(err);
      return res.json($user);
    });
  });
}

// DESTROY
// DELETE /users/:id
exports.destroyUser = function(req, res, next) {
  var id = req.params.id;

  var query = { _id: id };
  var promise = User.findOneAndRemove(query)
    .exec();
  promise.then(function(user) {
    if(!user) throw error.gen('user not found', req);
    return user;
  }).then(function(user) {
    res.json(user);
  }, function(err) { next(err); });
}

// POST /verify/username
var verifyUsername = function(req, res, next) {
  var username = req.body['username'];
  var bevy_id = req.body['bevy_id'];

  if(username == undefined) return next('Username not defined');
  if(bevy_id == undefined) return next('Bevy ID not defined');

  User.findOne({ $and: [{ bevy: bevy_id }, { username: username }]}, function(err, user) {
    if(err) return next(err);
    if(!user) return res.json({ found: false });
    else return res.json({ found: true });
  });
};
exports.verifyUsername = verifyUsername;

// POST /verify/email
var verifyEmail = function(req, res, next) {
  var email = req.body['email'];
  if(email == undefined) return next('Email not defined');
  User.findOne({ email: email }, function(err, user) {
    if(err) return next(err);
    if(!user) return res.json({ found: false });
    else return res.json({ found: true });
  });
};
exports.verifyEmail = verifyEmail;
