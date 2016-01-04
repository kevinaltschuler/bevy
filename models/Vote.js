/**
 * Vote.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var vote_types = 'post comment'.split(' ');

var VoteSchema = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
    default: shortid.generate
  },
  user: {
    type: String,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: vote_types
  },
  score: {
    type: Number,
    required: true,
    default: 1
  },
  post: {
    type: String,
    ref: 'Post'
  },
  comment: {
    type: String,
    ref: 'Comment'
  }
});

module.exports = mongoose.model('Vote', VoteSchema);
exports.schema = VoteSchema;
