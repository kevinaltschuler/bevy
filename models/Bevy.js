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
    default: shortid.generate(),
    unique: true,
    required: true
  },
  name: {
    type: String
  },
  slug: {
    type: String
  },
  image: ImageSchema,
  settings: {
    privacy: {
      type: String,
      default: 'Public'
    }
  },
  admins: [{
    type: String,
    ref: 'User'
  }],
  subCount: {
    type: Number,
    default: 0
  },
  boards: [{
    type: String,
    ref: 'Board'
  }],
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
