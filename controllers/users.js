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
  User.find(function(err, users) {
    if(err) return next(err);
    return res.json(users);
  }).limit(15);
}

// CREATE
// POST /users
exports.createUser = function(req, res, next) {
  //TODO: check for dupes
  //TODO: verify email
  var update = {
    _id: shortid.generate(),
    username: req.body['username'],
    password: req.body['password']
  }
  if(req.body['email'] != undefined)
    update.email = req.body['email'];

  // check for required fields
  if(_.isEmpty(update.username))
    return next(error.gen('Missing Identifier - Username', req));
  else if(_.isEmpty(update.password))
    return next(error.gen('Missing Verification - Password', req));

  // hash password if it exists
  if(update.password) update.password = bcrypt.hashSync(update.password, 8);

  User.create(update, function(err, user) {
    if(err) return next(err);

    // send a welcome email
    if(!_.isEmpty(user.email)) {
      mailgun.messages().send({
          from: 'Bevy Team <contact@joinbevy.com>'
        , to: user.email
        , subject: 'Welcome to Bevy!'
        , text: 'Thanks for signing up for bevy! A prettier template is coming soon.'
      });
    }

    // push existing notifications
    //Notification.update({ email: user.email }, { user: user._id }, { multi: true }, function(err, raw) {
    //});

    return res.json(user);
  });
}

// SHOW
// GET /users/:id/
exports.getUser = function(req, res, next) {
  var id = req.params.id;
  var query = { _id: id };
  var promise = User.findOne(query)
    .exec();
  promise.then(function(user) {
    if(!user) throw error.gen('user not found', req);
    return user;
  }).then(function(user) {
    res.json(user);
  }, function(err) { next(err); });
}

//SEARCH
//GET /users/search/:query
exports.searchUsers = function(req, res, next) {
	var query = req.params.query;
  var promise;
  if(_.isEmpty(query)) {
    promise = User.find()
      .limit(10)
      .exec();
  } else {
    promise = User.find()
      .limit(10)
      .or([
        { email: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { 'google.displayName': { $regex: query, $options: 'i' } },
      ])
      .exec();
  }
  promise.then(function(users) {
    return res.json(users);
  }, function(err) { return next(err); });
}

// UPDATE
// PUT/PATCH /users/:id
exports.updateUser = function(req, res, next) {
  var id = req.params.id;

  var update = {};
  update.updated = new Date();
  if(req.body['bevies'] != undefined)
    update.bevies = req.body['bevies'];
  if(req.body['image'] != undefined)
    update.image = req.body['image'];
  if(req.body['boards'] != undefined)
    update.boards = req.body['boards'];

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
      console.log('board add success');
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

// GET /users/google/:googleid
exports.getUserFromGoogle = function(req, res, next) {
  var google_id = req.params.googleid;
  User.findOne({ 'google.id': google_id }, function(err, user) {
    if(err) return next(err);
    return res.json(user);
  });
};

// GET /users/:username/verify
exports.verifyUsername = function(req, res, next) {
  var username = req.params.username;

  User.findOne({ username: username }, function(err, user) {
    if(err) return next(err);
    if(!user) return res.json({ found: false });
    else return res.json({ found: true });
  });
};

// GET /users/:id/devices
exports.getDevices = function(req, res, next) {
  var user_id = req.params.id;
  User.findOne({ _id: user_id }, function(err, user) {
    if(err) return next(err);
    return res.json(user.devices);
  });
};

// POST /users/:id/devices
exports.addDevice = function(req, res, next) {
  console.log('attempting to add device');
  var user_id = req.params.id;
  var token = req.body['token'];
  if(_.isEmpty(token)) return next('No device token supplied');
  var platform = req.body['platform'];
  if(_.isEmpty(platform)) return next('No device platform supplied');

  User.findOne({ _id: user_id }, function(err, user) {
    if(err) return next(err);
    // check for dupe
    if(_.findWhere(user.devices, { token: token }) != undefined) {
      return next('Device already added');
    }
    // new device object
    var new_device = {
      token: token,
      platform: platform
    };
    // add additional device information if it exists
    var additional_keys = ('deviceID manufacturer model uniqueID name version '
     + 'bundleID buildNum appVersion appVersionReadable').split(' ');
    for(var i in additional_keys) {
      var key = additional_keys[i];
      if(req.body[key])
        new_device[key] = req.body[key];
    }
    // push the new device
    user.devices.push(new_device);
    // save to database
    user.save(function(err, $user) {
      if(err) return next(err);
      console.log('device successfully added!')
      return res.json($user);
    });
  });
};

// PUT /users/:id/devices/:deviceid
// PATCH /users/:id/devices/:deviceid
exports.updateDevice = function(req, res, next) {
  var user_id = req.params.id;
  var device_id = req.params.deviceid;

  User.findOne({ _id: user_id }, function(err, user) {
    if(err) return next(err);
    // get device
    var device = _.findWhere(user.devices, { _id: device_id });
    // check if device exists
    if(device == undefined) {
      return next('Device not found')
    }
    // push new device information
    var keys = ('token platform deviceID manufacturer model uniqueID name version '
     + 'bundleID buildNum appVersion appVersionReadable').split(' ');
    for(var i in keys) {
      var key = keys[i];
      if(req.body[key])
        device[key] = req.body[key];
    }
    // remove the old device
    user.devices.pull({ _id: device_id });
    // push the new device
    user.devices.push(device);
    // save to database
    user.save(function(err, $user) {
      if(err) return next(err);
      return res.json($user);
    });
  })
};

// DELETE /users/:id/device/:deviceid
exports.removeDevice = function(req, res, next) {
  var user_id = req.params.id;
  var device_id = req.params.deviceid;

  var device_id = req.body['device_id'];
  if(_.isEmpty(device_id)) return next('No device id supplied');

  User.findOne({ _id: user_id }, function(err, user) {
    if(err) return next(err);
    if(_.findWhere(user.devices.toObject, { _id: device_id }) == undefined) {
      return next('Device not found');
    }
    user.devices.pull({ _id: device_id });
    user.save(function(err, $user) {
      if(err) return next(err);
      return res.json($user);
    });
  });
};
