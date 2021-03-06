/**
 * notifications.js
 * API for notifications
 * @author albert
 * @flow
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var messageBus = new EventEmitter();

var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var error = require('./../error');
var shortid = require('shortid');

var mailgun = require('./../config/mailgun')();
var User = require('./../models/User');
var Comment = require('./../models/Comment');
var Post = require('./../models/Post');
var Bevy = require('./../models/Bevy');
var Board = require('./../models/Board');
var Notification = require('./../models/Notification');

var paramNames = 'event message email board user members';

var emitter = new EventEmitter();
emitter.setMaxListeners(0);

exports.emitter = emitter;

// POST /notifications
exports.createNotification = function(req, res, next) {
  var params = {};
  params._id = shortid.generate();
  if(req.body['user'] != undefined)
    params.user = req.body['user'];
  if(req.body['email'] != undefined)
    params.email = req.body['email'];
  if(req.body['event'] != undefined)
    params.event = req.body['event'];
  if(req.body['data'] != undefined)
    params.data = req.body['data'];

  if(!params.event) {
    return next(error.gen('no event supplied'));
  }

  switch(params.event) {
    case 'test':
      break;

    case 'bevy:requestjoin':

      var bevy_id = req.body['bevy_id'];
      var bevy_name = req.body['bevy_name'];
      var user_id = req.body['user_id'];
      var user_name = req.body['user_name'];
      var user_image = req.body['user_image'];
      var user_email = req.body['user_email'];

      var notifications = [];
      // send to all admins
      Bevy.findOne({ _id: bevy_id }, function(err, bevy) {
        if(err) return next(err);
        User.find({ _id: { $in: bevy.admins } }, function(err, admins) {
          if(err) return next(err);
          admins.forEach(function(admin) {
            notifications.push({
              user: admin._id,
              event: 'bevy:requestjoin',
              data: {
                bevy_id: bevy_id,
                bevy_name: bevy_name,
                user_id: user_id,
                user_name: user_name,
                user_image: user_image,
                user_email: user_email,
                _id: shortid.generate
              }
            });
          });
          pushNotifications(notifications);
        });
      });
      break;
  }
  return res.json(params);
}

// GET /users/:userid/notifications
exports.getUserNotifications = function(req, res, next) {
  var userid = req.params.userid;
  var query = { user: userid };
  var promise = Notification.find(query).exec();
  promise.then(function(notifications) {
    return res.json(notifications);
  }, function(err) {
    return next(err);
  });
}

// GET /notifications/:notificationid
exports.getNotification = function(req, res, next) {
  var notification_id = req.params.notificationid;
  Notification.findOne({ _id: notification_id }, function(err, notification) {
    if(err) return next(err);
    return res.json(notification);
  });
}

// DELETE /notifications/:notificationid
exports.destroyNotification = function(req, res, next) {
  var notification_id = req.params.notificationid;
  Notification.findOneAndRemove({ _id: notification_id }, function(err, notification) {
    if(err) return next(err);
    return res.json(notification);
  });
}

// PUT/PATCH /notifications/:notificationid
exports.updateNotification = function(req, res, next) {
  var notification_id = req.params.notificationid;
  var update = {};
  if(req.body['read'] != undefined)
    update.read = req.body['read'];
  var query = { _id: notification_id };
  var promise = Notification.findOneAndUpdate(query, update, { new: true })
    .exec();
  promise.then(function(notification) {
    if(_.isEmpty(notification)) return next('Notification not found');
    return notification;
  }, function(err) {
    return next(err);
  });
};

function pushNotifications(notifications) {
  Notification.create(notifications, function(err, $notifications) {
    if(err) return;
    if(_.isEmpty($notifications)) return;
    // emit event
    if(_.isArray($notifications)) {
      $notifications.forEach(function(notification) {
        if(!_.isEmpty(notification.user))
          emitter.emit(notification.user, notification);
      });
    } else {
      if(!_.isEmpty($notifications.user))
        emitter.emit($notifications.user, $notifications);
    }
  });

  function APNRegisterDevice(data) {

  }
}
