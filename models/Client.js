/**
 * Client.js
 * oauth2 client
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  client_id: {
    type: String,
    required: true,
    unique: true
  },
  secret: {
    type: String,
    required: true
  },
  redirectUri: {
    type: String
  }
});

module.exports = mongoose.model('Client', ClientSchema);
