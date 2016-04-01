/**
 * Event.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var EventSchema = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
    default: shortid.generate
  },
  bevy: {
    type: String,
    required: true,
    ref: 'Bevy'
  },
  author: {
    type: String,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date
  },
  location: {
    type: String
  },
  description: {
    type: String
  },
  attendees: [{
    type: String,
    ref: 'User'
  }],
  cap: {
    type: Number,
    default: -1
  },
  waitlist: [{
    type: String,
    ref: 'User'
  }]
});

EventSchema.set('toObject', {
  getters: true,
  virtuals: true
});
EventSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

EventSchema.index({
  title: 'text',
  description: 'text'
});

module.exports = mongoose.model('Event', EventSchema);
exports.Schema = EventSchema;
