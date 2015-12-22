/**
 * RefreshToken.js
 * oauth2 refresh token
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RefreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  client_id: {
    type: String,
    required: true,
    ref: 'Client'
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
