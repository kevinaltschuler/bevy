/**
 * InviteToken.js
 *
 * token created for invited users
 * a link that has the token's value is usually
 * sent through email
 *
 * @author albert
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var _ = require('underscore');

var InviteTokenSchema = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
    default: shortid.generate
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
});

var InviteToken = mongoose.model('InviteToken', InviteTokenSchema);

module.exports = InviteToken;
