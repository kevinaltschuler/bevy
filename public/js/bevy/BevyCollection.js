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
    return constants.apiurl + '/bevies';
  },
  filter: 'Most Subscribers',
  sortByAbc(bevy) {
    var name = bevy.get('name').toLowerCase();
    var nameValue = name.charCodeAt(0);
    return nameValue;
  },
  sortByZyx(bevy) {
    var name = bevy.get('name').toLowerCase();
    var nameValue = name.charCodeAt(0);
    return -nameValue;
  },
  sortByTop(bevy) {
    var subs = bevy.get('subCount');
    return -subs;
  },
  sortByBottom(bevy) {
    var subs = bevy.get('subCount');
    return subs;
  },
  sortByNew(bevy) {
    var date = Date.parse(bevy.get('created'));
    return -date;
  },
  sortByOld(bevy) {
    var date = Date.parse(bevy.get('created'));
    return date;
  }
});

module.exports = BevyCollection;
