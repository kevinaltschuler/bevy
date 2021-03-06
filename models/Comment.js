/**
 * Comment.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var CommentSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  postId: { // post comment is under
    type: String,
    ref: 'Post',
    required: true
  },
  parentId: { // parent comment, if one exists
    type: String,
    ref: 'Comment'
  },
  author: {
    type: String,
    ref: 'User'
  },
  body: String,
  comments: [{}],
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

CommentSchema.index({
  body: 'text'
});

CommentSchema.set('toObject', {
  getters: true,
  virtuals: true
});
CommentSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

module.exports = mongoose.model('Comment', CommentSchema);
exports.Schema = CommentSchema;
