/**
 * controllers/invites.js
 *
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var config = require('./../config');
var mongoose = require('mongoose');
var async = require('async');
var bcrypt = require('bcryptjs');
var shortid = require('shortid');

var User = require('./../models/User');
var Bevy = require('./../models/Bevy');
var InviteToken = require('./../models/InviteToken');

// GET /invites/:inviteid/
var getInvite = function(req, res, next) {
  var invite_id_or_token = req.params.inviteid;
  InviteToken.findOne({ $or: [{ _id: invite_id_or_token }, { token: invite_id_or_token }]}, function(err, inviteToken) {
    if(err) return next(err);
    if(!inviteToken) return next('Invite not found');
    if(_.isEmpty(inviteToken.bevy)) return next('Invite not linked to a bevy');
    return res.json(inviteToken);
  })
  .populate('bevy');
};
exports.getInvite = getInvite;

// POST /invites/:inviteid:/accept
var acceptInvite = function(req, res, next) {
  async.waterfall([
    // first fetch the invite token
    function(done) {
      var invite_id_or_token = req.params.inviteid;
      InviteToken.findOne({ $or: [{ _id: invite_id_or_token }, { token: invite_id_or_token }]}, function(err, inviteToken) {
        if(err) return done(err);
        return done(null, inviteToken);
      });
    },
    // then create the user
    function(inviteToken, done) {
      var username = req.body['username'];
      var password = req.body['password'];

      if(username == undefined) return done('Username not defined');
      if(password == undefined) return done('Password not defined');

      var newUser = {
        _id: shortid.generate(),
        email: inviteToken.email,
        bevy: inviteToken.bevy,
        username: username,
        password: bcrypt.hashSync(password, 8),
        created: Date.now()
      };
      User.create(newUser, function(err, user) {
        if(err) return done(err);
        return done(null, user, inviteToken);
      });
    },
    // finally delete the invite token
    function(user, inviteToken, done) {
      InviteToken.findOneAndRemove({ _id: inviteToken._id }, function(err, $inviteToken) {
        // dont crash if it failed this isn't that important
        if(err) console.log(err);
        return done(null, user);
      });
    }
  ], function(err, user) {
    if(err) return next(err);
    return res.json(user);
  });
};
exports.acceptInvite = acceptInvite;
