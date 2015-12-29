/**
 * InviteCollection.js
 * @author albert
 * @flow
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var InviteModel = require('./InviteModel');

var constants = require('./../constants');
var user = window.bootstrap.user;

var InviteCollection = Backbone.Collection.extend({
  model: InviteModel,
  comparator: '-created',
  url() {
    return constants.apiurl + '/users/' + user._id + '/invites';
  }
});

module.exports = InviteCollection;
