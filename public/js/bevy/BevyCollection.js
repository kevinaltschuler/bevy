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
  get(id_or_slug) {
    return this.find(function(bevy) {
      if(bevy.get('_id') == id_or_slug) return true;
      if(bevy.get('slug') == id_or_slug) return true;
      return false;
    });
  },
  url() {
    return constants.apiurl + '/users/' + user._id + '/bevies';
  },
  //filter: 'top'
});

module.exports = BevyCollection;
