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

var BoardSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate()
  },
  parents: [{
    type: String,
    ref: 'Bevy'
  }],
  name: {
    type: String
  },
  description: {
    type: String
  },
  slug: {
    type: String,
    unique: true
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
    posts_expire_in: {
      type: Number,
      default: -1
    },
    admin_post_only: {
      type: Boolean,
      default: false
    },
    group_chat: {
      type: Boolean,
      default: false
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
  if(_.isEmpty(this.slug)) return ('/boards/' + this._id + '/');
  return ('/boards/' + this.slug + '/');
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
