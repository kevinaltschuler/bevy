/*
 * ImageSchema.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var _ = require('underscore');

var ImageSchema = new Schema({
  _id: {
    type: String,
    unique: true
  },
  format: {
    type: String
  },
  geometry: {
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  filename: {
    type: String
  },
  length: {
    type: Number
  }
});

ImageSchema.virtual('orientation').get(function() {
  return (this.width >= this.height)
    ? 'landscape'
    : 'portrait';
});

ImageSchema.virtual('path').get(function() {
  return (_.isEmpty(this.filename))
    ? '/img/user-profile-icon.png'
    : '/files/' + this.filename;
});

ImageSchema.virtual('empty').get(function() {
  return (_.isEmpty(this.filename))
    ? true
    : false;
});

ImageSchema.set('toObject', {
  getters: true,
  virtuals: true
});
ImageSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

module.exports = ImageSchema;