/**
 * permissions/bevy.js
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var checkBackdoor = require('./backdoor');
var Bevy = require('./../../models/Bevy');

// see if the user has access to a private? bevy
exports.hasPrivateBevyAccess = function(req, res, next) {
  if(checkBackdoor(req)) return next();
  var user = req.user;
  var bevy_id_or_slug = req.params.bevyid;
  Bevy.findOne({ $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]}, function(err, bevy) {
    if(err) return next(err);
    if(_.isEmpty(bevy)) return next({
      code: 404,
      message: 'Bevy not found'
    });
    // if its public, dont need to check for membership
    if(bevy.settings.privacy == 'Public') return next();
    // if private or secret, then we need to check
    else if (bevy.settings.privacy == 'Private' || bevy.settings.privacy == 'Secret') {
      // see if this bevy is inside the user's collection
      if(_.contains(user.bevies, bevy._id)) return next();
      else return next({
        code: 403,
        message: 'User does not have permission to view this bevy'
      });
    }
  });
};

// check if the user is an admin of this bevy
exports.isBevyAdmin = function(req, res, next) {
  if(checkBackdoor(req)) return next();
  var user = req.user;
  var bevy_id_or_slug = req.params.bevyid;
  Bevy.findOne({ $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]}, function(err, bevy) {
    if(err) return next(err);
    if(_.isEmpty(bevy)) return next({
      code: 404,
      message: 'Bevy not found'
    });
    if(_.contains(bevy.admins, user._id)) return next();
    else return next({
      code: 403,
      message: 'User is not an admin of this bevy'
    });
  });
};

// check is the user is subscribed to this bevy
exports.isBevyMember = function(req, res, next) {
  if(checkBackdoor(req)) return next();
  var user = req.user;
  var bevy_id_or_slug = req.params.bevyid;
  Bevy.findOne({ $or: [{ _id: bevy_id_or_slug }, { slug: bevy_id_or_slug }]}, function(err, bevy) {
    if(err) return next(err);
    if(_.isEmpty(bevy)) return next({
      code: 404,
      message: 'Bevy not found'
    });
    if(_.contains(user.bevies, bevy._id)) return next();
    else return next({
      code: 403,
      message: 'User is not a member of this bevy'
    });
  });

};
