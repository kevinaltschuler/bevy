/**
 * Board.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var _ = require('underscore');

var ImageSchema = require('./ImageSchema');
var board_types = 'discussion event announcement'.split(' ');

var BoardSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate()
  },
  parent: {
    type: String,
    ref: 'Bevy',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    required: true,
    enum: board_types
  },
  image: ImageSchema,
  subCount: {
    type: Number,
    default: 0
  },
  admins: [{
    type: String,
    ref: 'User'
  }],
  settings: {
    admin_post_only: {
      type: Boolean,
      default: false
    },
    group_chat: {
      type: Boolean,
      default: true
    },
    privacy: {
      type: String,
      default: 'Public'
    }
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

BoardSchema.virtual('url').get(function() {
  return ('/boards/' + this._id + '/');
});

BoardSchema.set('toObject', {
  getters: true,
  virtuals: true
});
BoardSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

module.exports = mongoose.model('Board', BoardSchema);
