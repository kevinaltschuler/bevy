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

var emailController = require('./../controllers/email');

// POST /invites/
var createInvite = function(req, res, next) {
  var emails = req.body['emails'];
  var bevy_id = req.body['bevy_id'];
  var inviter_name = req.body['inviter_name'];
  var inviter_email = req.body['inviter_email'];

  if(emails == undefined) return next('Emails to invite not defined');
  if(bevy_id == undefined) return next('Bevy to invite to not defined');
  if(inviter_name == undefined) return next('Inviter name not defined');
  if(inviter_email == undefined) return next('Inviter email not defined');

  async.waterfall([
    // find the bevy that they're inviting to first
    function(done) {
      Bevy.findOne({ _id: bevy_id }, function(err, bevy) {
        if(err) return done(err);
        if(!bevy) return done('Bevy not found');
        return done(null, bevy);
      })
      .lean();
    },
    // create invite tokens
    function(bevy, done) {
      async.each(emails, function(email, callback) {
        // if the emails array has some empty emails, then continue. dont crash
        if(_.isEmpty(email)) return callback(null);

        // define new token object
        var new_token = {
          _id: shortid.generate(),
          token: shortid.generate(),
          email: email,
          bevy: bevy._id,
          created: Date.now()
        };
        // flush to db
        InviteToken.create(new_token, function(err, inviteToken) {
          if(err) return callback(err);
          // then send invite emails to all invited users
          emailController.sendEmail(email, 'invite', {
            user_email: email,
            bevy_name: bevy.name,
            bevy_slug: bevy.slug,
            invite_link: 'http://' + bevy.slug + '.' + config.app.server.domain
              + '/invite/' + inviteToken.token,
            inviter_email: inviter_email,
            inviter_name: inviter_name
          }, function(err, results) {
            // dont crash here - this isn't too crucial
            if(err) console.error(err);
            return callback(null);
          });
        });
      }, function(err) {
        if(err) return done(err);
        return done(null, bevy);
      });
    }
  ], function(err, result) {
    if(err) return next(err);
    return res.json(result);
  });
};
exports.createInvite = createInvite;

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

// GET /bevies/:bevyid/invites
var getBevyInvites = function(req, res, next) {
  var bevy_id = req.params.bevyid;
  InviteToken.find({ bevy: bevy_id }, function(err, inviteTokens) {
    if(err) return next(err);
    return res.json(inviteTokens);
  });
};
exports.getBevyInvites = getBevyInvites;

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
