/**
 * User.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var bcrypt = require('bcryptjs');

var DeviceSchema = require('./DeviceSchema');
var ImageSchema = require('./ImageSchema');

var UserSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    required: true,
    default: shortid.generate
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String
  },
  phone: {
    type: String,
    unique: true
  },
  image: ImageSchema,
  points: {
    type: Number,
    default: 0
  },
  postCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  bevy: {
    type: String,
    ref: 'Bevy',
    required: true
  },
  boards: [{
    type: String,
    ref: 'Board'
  }],
  devices: [ DeviceSchema ],
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

UserSchema.virtual('displayName').get(function() {
  if(!_.isEmpty(this.username)) {
    return this.username;
  } else if (!_.isEmpty(this.email)) {
    return this.email;
  } else {
    return "[deleted]";
  }
});

UserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.set('toObject', {
  getters: true,
  virtuals: true
});
UserSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.token;
    return ret;
  }
});

UserSchema.index({
  email: 'text',
  username: 'text'
});

UserSchema.pre('save', function(next) {
  // get a default image
  if(_.isEmpty(this.image)) {
    this.image = {
      filename: 'http://joinbevy.com/img/user-profile-icon.png',
      foreign: true
    };
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
