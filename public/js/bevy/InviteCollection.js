/**
 * InviteC0llection.js
 *
 * Backbone collection for Invites
 *
 * @author kevin
 */

'use strict';

var Backbone = require('backbone');

var Invite = require('./InviteModel');
var constants = require('./../constants');
var router = require('./../router');

var user = window.bootstrap.user;

var InviteCollection = Backbone.Collection.extend({
  model: Invite,
  get(id) {
    return this.find(function(invite) {
      if(invite.get('_id') == id) return true;
      return false;
    });
  },
  url() {
    return constants.apiurl + '/bevies/' + router.bevy_slug + '/invites';
  },
});

module.exports = InviteCollection;
