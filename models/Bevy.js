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
    default: shortid.generate,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  image: ImageSchema,
  settings: {
    privacy: {
      type: String,
      default: 'Private'
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
    default: Date.now,
    required: true
  },
  updated: {
    type: Date,
    default: Date.now
  }
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
