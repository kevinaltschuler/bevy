/**
 * Event.js
 * @author albert
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var EventSchema = new Schema({
  date: {
    type: Date
  },
  start: {
    type: Date
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
    type: Number
  },
  waitlist: [{
    type: String,
    ref: 'User'
  }]
});

module.exports = EventSchema;
