/**
 * controllers/devices.js
 *
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');

var User = require('./../models/User');

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
