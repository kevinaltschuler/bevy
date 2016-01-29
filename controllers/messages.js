/**
 * messages.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');
var shortid = require('shortid');

var mq = require('./../mq');
var emitter = require('./notifications').emitter;

var Message = require('./../models/Message');
var Thread = require('./../models/Thread');
var Bevy = require('./../models/Bevy');
var User = require('./../models/User');
var Board = require('./../models/Board');

var userPopFields = '_id displayName email image username '
 + 'google facebook created';

// GET /threads/:threadid/messages
exports.getMessages = function(req, res, next) {
  var thread_id = req.params.threadid;
  var skip = req.query['skip'] || 0;
  Message.find({ thread: thread_id }, function(err, messages) {
    if(err) return next(err);
    return res.json(messages);
  })
  .populate({
    path: 'author',
    select: userPopFields
  })
  .sort('-created')
  .skip(skip)
  .limit(25);
};

// POST /messages
exports.createMessage = function(req, res, next) {
  var thread_id = req.body['thread'];
  var author_id = req.body['author'];
  var body = req.body['body'];

  var message = {
    _id: shortid.generate(),
    thread: thread_id,
    author: author_id,
    body: body
  };

  Message.create(message, function(err, $message) {
    if(err) return next(err);
    Message.populate($message, { path: 'author thread' }, function(err, $pop_message) {
      if(err) return next(err);
      // now lets push it to everybody
      var event_data = JSON.stringify($pop_message);
      Thread.findOne({ _id: thread_id }, function(err, thread) {
        if(err) return next(err);
        if(!thread) return next('thread not found');
        if(!_.isEmpty(thread.board)) { // if its a board chat
          // send to board members
          User.find({ boards: thread.board }, function(err, users) {
            if(err) return next(err);
            sendChatNotification($pop_message, users);
          });
        } else {
          // send to each user
          sendChatNotification($pop_message, thread.users);
        }
      }).populate('users');
      return res.json($pop_message);
    });
  });
};

// GET /messages/:messageid
exports.getMessage = function(req, res, next) {
  var message_id = req.params.messageid;
  Message.findOne({ _id: message_id }, function(err, message) {
    if(err) return next(err);
    if(_.isEmpty(message)) return next('Message not found');
    return res.json(message);
  })
  .populate({
    path: 'author',
    select: userPopFields
  });
};

// PUT/PATCH /messages/:messageid
exports.updateMessage = function(req, res, next) {
  var message_id = req.params.messageid;
  var body = req.body['body'];
  var update = { body: body };
  Message.findOneAndUpdate({ _id: message_id }, update, { new: true, upsert: true },
    function(err, message) {
    if(err) return next(err);
    return res.json(message);
  })
  .populate({
    path: 'author',
    select: userPopFields
  });
};

// DELETE /messages/:messageid
exports.destroyMessage = function(req, res, next) {
  var message_id = req.params.messageid;
  Message.findOneAndRemove({ _id: message_id }, function(err, message) {
    if(err) return next(err);
    return res.json(message);
  })
  .populate({
    path: 'author',
    select: userPopFields
  });
};

function sendChatNotification(message, to_users) {
  for(var key in to_users) {
    var user = to_users[key];
    // websocket
    mq.pubSock.send(['chat.' + user._id, JSON.stringify(message)]);
  }
  // notifications
  var payload = {
    message: message,
    to_users: to_users
  };
  mq.pubSock.send(['chat_message', JSON.stringify(payload)]);
}
