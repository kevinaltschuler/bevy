/**
 * permissions/post.js
 * @author albert
 * @flow
 */

'use strict';

var checkBackdoor = require('./backdoor');
var Post = require('./../../models/Post');

var boardPermissions = require('./board');

exports.canViewPost = function(req, res, next) {
  if(checkBackdoor(req)) return next();
  var user = req.user;
  var post_id = req.params.postid;
  Post.findOne({ _id: post_id }, function(err, post) {
    if(err) return next(err);
    boardPermissions.checkPrivateBoardAccess(user, post.board, next);
  })
  .populate({
    path: 'board',
    select: '_id admins settings'
  });
};
