/**
 * BevyCollection.js
 *
 * Backbone collection for bevies
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');

var Bevy = require('./BevyModel');
var constants = require('./../constants');

var user = window.bootstrap.user;

// backbone collection
var BevyCollection = Backbone.Collection.extend({
  model: Bevy,
  url() {
    return constants.apiurl + '/users/' + user._id + '/bevies';
  },
  filter: 'top'
});

module.exports = BevyCollection;
