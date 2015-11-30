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

var default_path = 'http://joinbevy.com/img/user-profile-icon.png';

var ImageSchema = new Schema({
  // unique database id
  _id: {
    type: String
  },
  // image format
  // png, jpeg, gif, etc
  format: {
    type: String
  },
  // size of the image
  // used to request a smaller image (if needed) 
  // before the image is loaded from the server
  geometry: {
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  // if hosted on our server, a relative path
  // /asdf.png
  // if hosted on another server (foreign), an absolute path
  // i.imgur.com/asdf.png
  filename: {
    type: String
  },
  // size of the image in bytes
  length: {
    type: Number
  },
  // if the image is not being hosted on our server
  // used to tell the client that it can't use parameters 
  // to request a smaller image
  foreign: {
    type: Boolean
  }
});

ImageSchema.virtual('orientation').get(function() {
  return (this.width >= this.height)
    ? 'landscape'
    : 'portrait';
});

ImageSchema.virtual('path').get(function() {
  var res = '';
  res = (_.isEmpty(this.filename))
    ? '/img/user-profile-icon.png'
    : '/files/' + this.filename;
  if(this.foreign) res = this.filename;

  return (_.isEmpty(res))
    ? default_path
    : res;
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