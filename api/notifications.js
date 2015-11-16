/**
 * notifications.js
 *
 * API for notifications
 *
 * @author albert
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
var User = mongoose.model('User');
var Comment = mongoose.model('Comment');
var Post = mongoose.model('Post');
var Bevy = mongoose.model('Bevy');
var Notification = mongoose.model('Notification');

var paramNames = 'event message email bevy user members';

var emitter = new EventEmitter();
emitter.setMaxListeners(0);

exports.emitter = emitter;

function collectParams(req) {
  var params = {};
  paramNames.split(' ').forEach(function(param) {
    var val = null;
    if(req.body != undefined) val = req.body[param];
    if(!val && !_.isEmpty(req.query)) val = req.query[param];
    if(!val) return;
    params[param] = val;
  });
  return params;
}

// POST /notifications
exports.create = function(req, res, next) {
  var params = collectParams(req);

  if(!params.event) {
    return next(error.gen('no event supplied'));
  }

  switch(params.event) {
    case 'test':
      //console.log(params);
      break;
    case 'invite:email':
      var bevy_id = req.body['bevy_id'];
      var bevy_name = req.body['bevy_name'];
      var bevy_img = req.body['bevy_img'];
      var inviter_name = req.body['inviter_name'];
      var emails = req.body['emails']

      var template = require('./../public/html/email/template.jsx')(bevy_name, inviter_name, bevy_id);

      var notifications = [];

      async.waterfall([
        function(done) {
          emails.forEach(function(email) {
            // push the notification object onto a matching user
            User.findOne({ email: email }, function(err, user) {
              if(err) return next(err);
              if(!user) {
                notifications.push({
                  email: email,
                  event: 'invite:email',
                  data: {
                    bevy_id: bevy_id,
                    bevy_name: bevy_name,
                    bevy_img: bevy_img,
                    inviter_name: inviter_name,
                    _id: shortid.generate
                  }
                });
              } else {
                notifications.push({
                  user: user._id,
                  event: 'invite:email',
                  data: {
                    bevy_id: bevy_id,
                    bevy_name: bevy_name,
                    bevy_img: bevy_img,
                    inviter_name: inviter_name,
                    _id: shortid.generate
                  }
                });
              }

              if(notifications.length == members.length) done(null); // continue when ready
            });

            // then send the invite email
            mailgun.messages().send({
              from: 'Bevy Team <contact@joinbevy.com>',
              to: email,
              subject: 'Invite',
              html: template
            }, function(err, body) {
              if(err) return next(err);
            });
          });
        },
        function(err, done) {
          pushNotifications(notifications);
        }
      ]);

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
exports.index = function(req, res, next) {
  var userid = req.params.userid;
  var query = { user: userid };
  var promise = Notification.find(query).exec();
  promise.then(function(notifications) {
    return res.json(notifications);
  }, function(err) {
    return next(err);
  });
}

// GET /users/:userid/notifications/:id
exports.show = function(req, res, next) {
  var id = req.params.id;
  Notification.findOne({ _id: id }, function(err, notification) {
    if(err) return next(err);
    return res.json(notification);
  });
}

// GET /users/:userid/notifications/:id/destroy
// DELETE /users/:userid/notifications
exports.destroy = function(req, res, next) {
  var id = req.params.id;
  Notification.findOneAndRemove({ _id: id }, function(err, notification) {
    if(err) return next(err);
    return res.json(notification);
  });
}

// GET /users/:userid/notifications/poll
exports.poll = function(req, res, next) {
  var user_id = req.params.userid;

    // user started polling
    // check if theyre in the online users list
    // if not add.

    // set a timer - 40 seconds - if this isnt hit again then set them as offline

  emitter.on(user_id, function(notification) {
    if(!res.headersSent)
      return res.json({
        type: 'notification',
        data: notification
      });
    else return res.end();
  });
  emitter.on(user_id + ':chat', function(message) {
    if(!res.headersSent)
      return res.json({
        type: 'message',
        data: message
      });
    else return res.end();
  });
}

// PATCH /users/:userid/notifications/:id
exports.update = function(req, res, next) {
  var id = req.params.id;
  var update = {};
  if(req.body['read'] != undefined)
    update.read = req.body['read'];
  var query = { _id: id };
  var promise = Notification.findOneAndUpdate(query, update, {new: true})   
    .exec();
  promise.then(function(notification) {
    if(!notification) next('notification not found');
    return notification;
  });
}

exports.offline = function(req, res, next) {
  // check if in the online users list
  // if yes, remove
  console.log('caught offline');
}

exports.make = function(type, payload) {
  switch(type) {
    case 'post:create':
      var post = JSON.parse(JSON.stringify(payload.post));
      var author = post.author;
      var bevy = post.bevy;

      var notifications = [];
      // get all users of the bevy
      User.find({ bevies: bevy._id }, function(err, users) {
        if(err) return;
        users.forEach(function(user) {
          //TODO: check user notification preferences here
          if(user._id == author._id) return; // dont send to author of post
          notifications.push({
            user: user._id,
            event: 'post:create',
            data: {
              author_name: author.displayName,
              author_img: author.image_url,
              bevy_id: bevy._id,
              bevy_name: bevy.name,
              post_title: post.title,
              post_id: post._id,
              post_created: post.created
            }
          });
        });
        pushNotifications(notifications);
      });
      break;

    case 'comment:create':
      var comment = JSON.parse(JSON.stringify(payload.comment));
      var post = comment.postId;
      var author = comment.author;

      var notifications = [];
      // send post reply to author
      // query for bevy because we need its name
      Bevy.findOne({ _id: post.bevy }, function(err, bevy) {
        if(err) return;
        if(author._id == post.author) return; // dont send to self
        notifications.push({
          user: post.author,
          event: 'post:reply',
          data: {
            author_name: author.displayName,
            author_image: author.image_url,
            post_title: post.title,
            bevy_name: bevy.name,
            bevy_id: bevy._id,
            post_id: post._id,
            comment_id: comment._id,
            comment_created: comment.created
          }
        });

        // send commentedon notifications to parent comment
        Comment.findOne({ _id: comment.parentId }, function(err, $comment) {
          if(err) return;
          if(author._id == $comment.author) return; // dont send to self
          if(_.isEmpty($comment)) {
            // parent comment not found
            pushNotifications(notifications);
            return;
          }
          notifications.push({
            user: $comment.author,
            event: 'post:commentedon', //TODO: change to comment:reply
            data: {
              author_name: author.displayName,
              author_image: author.image_url,
              post_title: post.title,
              bevy_name: bevy.name,
              bevy_id: bevy._id,
              comment_id: comment._id,
              comment_created: comment.created
            }
          });
          pushNotifications(notifications);
        });
      });

      break;
  }
}

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
