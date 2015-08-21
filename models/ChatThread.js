'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var thread_types = 'pm group bevy'.split(' ');
// pms can only contain two users
// group chats can contain multiple users
// bevy chats are attached to a bevy, and rely on the bevies' suscribers instead of the users field

var ChatThread = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate()
  },
  name: {
    type: String
  },
  image_url: {
    type: String
  },
  type: {
    type: String,
    enum: thread_types,
    default: 'bevy'
  },
  bevy: {
    type: String,
    ref: 'Bevy'
  },
  users: [{
    type: String,
    ref: 'User'
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

module.exports = ChatThread;
