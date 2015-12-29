/**
 * invites.js
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var async = require('async');
var shortid = require('shortid');

var Invite = require('./../models/Invite');
var Bevy = require('./../models/Bevy');
var Board = require('./../models/Board');

var bevyPopFields = '_id name admins settings image';
var boardPopFields = '_id name admins settings image';

// GET /bevies/:bevyid/invites
exports.getBevyInvites = function(req, res, next) {
  var bevy_id = req.params.bevyid;
  Invite.find({ $and: [{ type: 'bevy' }, { bevy: bevy_id }]}, function(err, invites) {
    if(err) return next(err);
    return res.json(invites);
  });
};

// GET /boards/:boardid/invites
exports.getBoardInvites = function(req, res, next) {
  var board_id = req.params.boardid;
  Invite.find({ $and: [{ type: 'board' }, { board: board_id }]}, function(err, invites) {
    if(err) return next(err);
    return res.json(invites);
  });
};

// GET /users/:userid/invites
exports.getUserInvites = function(req, res, next) {
  var user_id = req.params.userid;
  Invite.find({ user: user_id }, function(err, invites) {
    if(err) return next(err);
    return res.json(invites);
  })
  .populate({
    path: 'bevy',
    select: bevyPopFields
  })
  .populate({
    path: 'board',
    select: boardPopFields
  });
};

// POST /invites
exports.createInvite = function(req, res, next) {
  var update = {};
  update._id = shortid.generate();
  if(req.body['user'] == undefined) return next('Invite user not defined');
  else update.user = req.body['user'];
  if(req.body['type'] == undefined) return next('Invite type not defined');
  else update.type = req.body['type'];
  if(req.body['requestType'] == undefined) return next('Invite request type not defined');
  else update.requestType = req.body['requestType'];
  if(req.body['bevy'] != undefined) update.bevy = req.body['bevy'];
  if(req.body['board'] != undefined) update.board = req.body['board'];

  async.waterfall([
    // check for existing invite
    function(done) {
      var type_query = (update.type == 'bevy')
        ? { bevy: update.bevy }
        : { board: update.board };
      Invite.findOne({ $and: [{ user: update.user }, type_query]}, function(err, invite) {
        if(err) return done(err);
        if(!_.isEmpty(invite)) return done('Invite already exists');
        else return done(null);
      });
    },
    // then create invite
    function(done) {
      Invite.create(update, function(err, invite) {
        if(err) return done(err);
        // TODO SEND NOTIFICATIONS
        return done(null, invite);
      });
    }
  ], function(err, invite) {
    if(err) return next(err);
    return res.json(invite);
  });
};

// GET /invites/:inviteid/accept
exports.acceptInvite = function(req, res, next) {
  var invite_id = req.params.inviteid;
  Invite.findOne({ _id: invite_id }, function(err, invite) {
    if(err) return next(err);
    if(_.isEmpty(invite)) return next('Invite not found');
    switch(invite.type) {
      case 'bevy':
        User.findOne({ _id: invite.user }, function(err, user) {
          if(err) return next(err);
          if(_.isEmpty(user)) return next('User not found');
          user.bevies.push(invite.bevy);
          user.save(function(err) {
            if(err) return next(err);
            return res.send('Success');
          });
        });
        break;
      case 'board':
        User.findOne({ _id: invite.user }, function(err, user) {
          if(err) return next(err);
          if(_.isEmpty(user)) return next('User not found');
          user.boards.push(invite.board);
          user.save(function(err) {
            if(err) return next(err);
            return res.send('Success');
          });
        });
        break;
      default:
        return next('Unknown invite type');
        break;
    }
  });
};

// GET /invites/:inviteid/reject
exports.rejectInvite = function(req, res, next) {
  var invite_id = req.params.inviteid;
  Invite.findOneAndRemove({ _id: invite_id }, function(err, invite) {
    if(err) return next(err);
    // TODO inform user that their invite has been rejected?
    return res.json(invite);
  });
};

// DELETE /invites/:inviteid
exports.destroyInvite = function(req, res, next) {
  var invite_id = req.params.inviteid;
  Invite.findOneAndRemove({ _id: invite_id }, function(err, invite) {
    if(err) return next(err);
    return res.json(invite);
  });
};
