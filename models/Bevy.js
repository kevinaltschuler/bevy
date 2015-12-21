/**
 * Bevy.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var _ = require('underscore');

var ImageSchema = require('./ImageSchema');

var BevySchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate()
  },
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
    anonymise_users: {
      type: Boolean,
      default: false
    },
    group_chat: {
      type: Boolean,
      default: true
    },
    privacy: {
      type: Number,
      default: 1
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

BevySchema.virtual('url').get(function() {
  if(_.isEmpty(this.slug)) return ('/b/' + this._id + '/');
  return ('/b/' + this.slug + '/');
});

BevySchema.set('toObject', {
  getters: true,
  virtuals: true
});
BevySchema.set('toJSON', {
  getters: true,
  virtuals: true
});

module.exports = mongoose.model('Bevy', BevySchema);
