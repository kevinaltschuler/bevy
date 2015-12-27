/**
 * permissions/post.js
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var checkBackdoor = require('./backdoor');
var Post = require('./../../models/Post');

var boardPermissions = require('./board');

exports.canViewPost = function(req, res, next) {
  if(checkBackdoor(req)) return next();
  var user = req.user;
  var post_id = req.params.postid;
  Post.findOne({ _id: post_id }, function(err, post) {
    if(err) return next(err);
    if(_.isEmpty(post)) return next({
      code: 404,
      message: 'Post not found'
    });
    boardPermissions.checkPrivateBoardAccess(user, post.board, next);
  })
  .populate({
    path: 'board',
    select: '_id admins settings'
  })
  .lean();
};

exports.canModifyPost = function(req, res, next) {
  if(checkBackdoor(req)) return next();
  var user = req.user;
  var post_id = req.params.postid;
  Post.findOne({ _id: post_id }, function(err, post) {
    if(err) return next(err);
    if(_.isEmpty(post)) return next({
      code: 404,
      message: 'Post not found'
    });
    // is the user the author of the post?
    if(post.author == user._id) return next();
    else {
      // is the user an admin of the board this was posted in?
      if(_.contains(post.board.admins, user._id)) {
        // check board membership just to make sure
        //boardPermissions.checkPrivateBoardAccess(user, post.board, next);
        return next();
      } else {
        return next({
          code: 403,
          message: 'User does not have the permissions to modify this post'
        });
      }
    }
  })
  .populate({
    path: 'board',
    select: '_id admins settings'
  })
  .lean();
};
