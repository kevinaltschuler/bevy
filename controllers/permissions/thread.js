/**
 * permissions/thread.js
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var checkBackdoor = require('./backdoor');

var Thread = require('./../../models/Thread');
var Message = require('./../../models/Message');

exports.isThreadMember = function(req, res, next) {
  if(checkBackdoor(req)) return next();
  var user = req.user;
  var thread_id = req.params.threadid;
  if(_.isEmpty(thread_id)) thread_id = req.body['thread_id'];
  if(_.isEmpty(thread_id)) thread_id = req.body['thread'];

  if(_.isEmpty(thread_id) && !_.isEmpty(req.params.messageid)) {
    var message_id = req.params.messageid;
    Message.findOne({ _id: message_id }, function(err, message) {
      if(err) return next(err);
      if(_.isEmpty(message)) return next({
        code: 404,
        message: 'Chat message not found'
      });
      thread_id = message.thread;
      checkThreadMembership(user, thread_id, next);
    });
  } else {
    checkThreadMembership(user, thread_id, next);
  }
};

var checkThreadMembership = function(user, thread_id, next) {
  Thread.findOne({ _id: thread_id }, function(err, thread) {
    if(err) return next(err);
    if(_.isEmpty(thread)) return next({
      code: 404,
      message: 'Thread not found'
    });
    // if this is a bevy thread
    if(!_.isEmpty(thread.bevy)) {
      if(_.contains(user.bevies, thread.bevy)) return next();
      else return next({
        code: 403,
        message: 'User is not a member of this bevy chat'
      });
    } else if(thread.type == 'group') {
      if(_.contains(thread.users, user._id)) return next();
      else return next({
        code: 403,
        message: 'User is not a member of this group chat'
      });
    } else if(thread.type == 'pm') {
      if(_.contains(thread.users, user._id)) return next();
      else return next({
        code: 403,
        message: 'User is not a member of this private chat'
      });
    } else {
      return next({
        code: 500,
        message: 'Unknown thread verification error'
      });
    }
  });
};
exports.checkThreadMembership = checkThreadMembership;
