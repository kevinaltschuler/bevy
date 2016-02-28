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
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  name: {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    }
  },
  phoneNumber: {
    type: String
  },
  title: {
    type: String
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
  if(!_.isEmpty(this.name.firstName) || !_.isEmpty(this.name.lastName)) {
    return this.name.firstName + ' ' + this.name.lastName;
  } else if(!_.isEmpty(this.username)) {
    return this.username;
  } else if (!_.isEmpty(this.email)) {
    return this.email;
  } else {
    return "[deleted]";
  }
});

UserSchema.virtual('fullName').get(function() {
  // if no name fields are filled out, then return the username
  if(_.isEmpty(this.name.firstName) && _.isEmpty(this.name.lastName)) {
    return '';

  // if only the last name is filled out, return that
  } else if (_.isEmpty(this.name.firstName)) {
    return this.name.lastName;

  // if only the first name is filled out, return that
  } else if (_.isEmpty(this.name.lastName)) {
    return this.name.firstName;

  // otherwise, both name fields are filled out. return both
  } else {
    return this.name.firstName + ' ' + this.name.lastName;
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
  username: 'text',
  'name.firstName': 'text',
  'name.lastName': 'text'
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
