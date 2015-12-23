/**
 * Code.js
 * oauth2 authorization code
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CodeSchema = new Schema({
  authCode: {
    type: String,
    required: true
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
  expires: {
    type: Date
  }
});

module.exports = mongoose.model('Code', CodeSchema);
