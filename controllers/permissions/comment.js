/**
 * permissions/comment.js
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');

var checkBackdoor = require('./backdoor');
var boardPermissions = require('./board');

var Comment = require('./../../models/Comment');
var Post = require('./../../models/Post');
var Board = require('./../../models/Board');

exports.canCreateComment = function(req, res, next) {
  if(checkBackdoor(req)) return next();
  var user = req.user;
  var post_id = req.body['postId'];
  Post.findOne({ _id: post_id }, function(err, post) {
    if(err) return next(err);
    if(_.isEmpty(post)) return next('Post not found');
    boardPermissions.checkPrivateBoardAccess(user, post.board, next);
  })
  .populate({
    path: 'board',
    select: '_id admins settings'
  })
  .lean();
};

exports.canViewComment = function(req, res, next) {
  if(checkBackdoor(req)) return next();
  var user = req.user;
  var comment_id = req.params.commentid;
  Comment.findOne({ _id: comment_id }, function(err, comment) {
    if(err) return next(err);
    if(_.isEmpty(comment)) return next('Comment does not exist');
    Post.findOne({ _id: comment.postId }, function(err, post) {
      if(err) return next(err);
      if(_.isEmpty(post)) return next("Comment's parent post does not exist");
      boardPermissions.checkPrivateBoardAccess(user, post.board, next);
    })
    .populate({
      path: 'board',
      select: '_id admins settings'
    })
    .lean();
  })
  .lean();
};

exports.canModifyComment = function(req, res, next) {
  if(checkBackdoor(req)) return next();
  var user = req.user;
  var comment_id = req.params.commentid;
  Comment.findOne({ _id: comment_id }, function(err, comment) {
    if(err) return next(err);
    if(_.isEmpty(comment)) return next('Comment does not exist');
    // allow comment's author to modify their own comment
    if(user._id == comment.author) return next();
    Post.findOne({ _id: comment.postId }, function(err, post) {
      if(err) return next(err);
      if(_.isEmpty(post)) return next("Comment's parent post does not exist");
      if(_.contains(post.board.admins, user._id)) return next();
      else return next("Insufficient privileges to modify comment");
    })
    .populate({
      path: 'board',
      select: '_id admins'
    })
    .lean();
  })
  .lean();
};
