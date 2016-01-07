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
    default: shortid.generate
  },
  token: String,
  password: String,
  username: {
    type: String
  },
  email: {
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
  google: {
    provider: String,
    id: String,
    name: {
      familyName: String,
      givenName: String,
      middleName:String
    },
    displayName: String,
    token: String,
    emails: [Schema({
      value: String,
      type: {
        type: String
      }
    }, {
      _id: false
    })],
    photos: [Schema({
      value: String
    }, {
      _id: false
    })]
  },
  facebook: {
    provider: String,
    id: String,
    name: {
      familyName: String,
      givenName: String,
      middleName:String
    },
    displayName: String,
    token: String,
    emails: [Schema({
      value: String,
      type: {
        type: String
      }
    }, {
      _id: false
    })],
    photos: [Schema({
      value: String
    }, {
      _id: false
    })]
  },
  bevies: [{
    type: String,
    ref: 'Bevy'
  }],
  boards: [{
    type: String,
    ref: 'Board'
  }],
  devices: [ DeviceSchema ],
  online: {
    type: Boolean,
    default: false
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

UserSchema.virtual('displayName').get(function() {
  if(!_.isEmpty(this.username)) {
    return this.username;
  } else {
    if(!_.isEmpty(this.google.id)) {
      // use google data
      if(_.isEmpty(this.google.displayName)) {
        // use google email
        return this.email;
      } else {
        // use google name
        return this.google.displayName;
      }
    } else if(!_.isEmpty(this.facebook.id)) {
      // use facebook data
      if(_.isEmpty(this.facebook.displayName)) {
        // use facebook email
        return this.email;
      } else {
        // use facebook name
        return this.facebook.displayName;
      }
    } else if (!_.isEmpty(this.email)) {
      return this.email;
    } else {
      return "[deleted]";
    }
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
  'google.displayName': 'text',
  'facebook.displayName': 'text'
});

UserSchema.pre('save', function(next) {
  // get a default image
  if(_.isEmpty(this.image)) {
    if(!_.isEmpty(this.google.photos)) {
      this.image = {
        filename: this.google.photos[0].value,
        foreign: true
      };
    } else if (!_.isEmpty(this.facebook.photos)) {
      this.image = {
        filename: this.facebook.photos[0].value,
        foreign: true
      };
    } else {
      this.image = {
        filename: 'http://joinbevy.com/img/user-profile-icon.png',
        foreign: true
      };
    }
  }

  // get an email from google or facebook if none exist
  if(_.isEmpty(this.email)) {
    if(!_.isEmpty(this.google.emails)) {
      this.email = this.google.emails[0].value;
    } else if (!_.isEmpty(this.facebook.emails)) {
      this.email = this.facebook.emails[0].value;
    }
  }
});

module.exports = mongoose.model('User', UserSchema);
