/**
 * InviteModel.js
 * Backbone model for Invites
 * @author kevin
 */

'use strict';

// imports
var Backbone = require('backbone');

var constants = require('./../constants');

// backbone model
var InviteModel = Backbone.Model.extend({
  idAttribute: '_id'
});

module.exports = InviteModel;
