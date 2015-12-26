/**
 * permissions/index.js
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var config = require('./../../config');

var checkBackdoor = require('./backdoor');
var userPermissions = require('./user');
var bevyPermissions = require('./bevy');
var boardPermissions = require('./board');
var commentPermissions = require('./comment');
var postPermissions = require('./post');
var threadPermissions = require('./thread');
var messagePermissions = require('./message');

// any error passed by permissions middleware will go through this
// it returns a 401 Unauthorized status and a relevant error message
exports.errorHandler = function(err, req, res, next) {
  if(_.isEmpty(err)) return next();
  else if(_.isObject(err)) {
    return res.status(err.code).send(
      (typeof err.message === 'string')
        ? err.message
        : err.message.toString()
    );
  } else {
    // generic unauthorized error
    return res.status(401).send(err.toString());
  }
};

exports.isSameUser = userPermissions.isSameUser;

exports.hasPrivateBevyAccess = bevyPermissions.hasPrivateBevyAccess;
exports.isBevyAdmin = bevyPermissions.isBevyAdmin;
exports.isBevyMember = bevyPermissions.isBevyMember;

exports.hasPrivateBoardAccess = boardPermissions.hasPrivateBoardAccess;
exports.isBoardAdmin = boardPermissions.isBoardAdmin;
exports.isBoardMember = boardPermissions.isBoardMember;

exports.canCreateComment = commentPermissions.canCreateComment;
exports.canModifyComment = commentPermissions.canModifyComment;
exports.canViewComment = commentPermissions.canViewComment;

exports.canViewPost = postPermissions.canViewPost;

exports.isThreadMember = threadPermissions.isThreadMember;

exports.checkBackdoor = checkBackdoor;
