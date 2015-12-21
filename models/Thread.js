/**
 * Thread.js
 * @author albert
 * @flow
 */

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var ImageSchema = require('./ImageSchema');

var thread_types = 'pm group bevy'.split(' ');
// pms can only contain two users
// group chats can contain multiple users
// bevy chats are attached to a bevy, and rely on the bevies' suscribers instead of the users field

var ThreadSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate()
  },
  name: {
    type: String
  },
  image: ImageSchema,
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

ThreadSchema.set('toObject', {
  getters: true,
  virtuals: true
});
ThreadSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

module.exports = mongoose.model('Thread', ThreadSchema);
