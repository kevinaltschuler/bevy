/**
 * Invite.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var invite_types = 'bevy boards'.split(' ');
var invite_request_types = 'request_join invite'.split(' ');

var InviteSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    required: true,
    default: shortid.generate()
  },
  user: {
    type: String,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: invite_types
  },
  requestType: {
    type: String,
    required: true,
    enum: invite_request_types
  },
  bevy: {
    type: String,
    ref: 'Bevy'
  },
  board: {
    type: String,
    ref: 'Board'
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
});

InviteSchema.set('toObject', {
  getters: true,
  virtuals: true
});
InviteSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

module.exports = mongoose.model('Invite', InviteSchema);
exports.schema = InviteSchema;
