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

var User = require('./../models/User');
var Bevy = require('./../models/Bevy');
var InviteToken = require('./../models/InviteToken');

// GET /invites/:inviteid/
var getInvite = function(req, res, next) {
  var invite_id_or_token = req.params.inviteid;
  InviteToken.findOne({ $or: [{ _id: invite_id_or_token },{ token: invite_id_or_token }] }, function(err, inviteToken) {
    if(err) return next(err);
    if(!inviteToken) return next('Invite not found');
    if(_.isEmpty(inviteToken.bevy)) return next('Invite not linked to a bevy');
    return res.json(inviteToken);
  })
  .populate('bevy');
};
exports.getInvite = getInvite;
