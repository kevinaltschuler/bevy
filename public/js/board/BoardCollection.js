/**
 * BoardCollection.js
 *
 * Backbone collection for boards
 *
 * @author kevin
 */

'use strict';

// imports
var Backbone = require('backbone');

var Board = require('./BoardModel');
var constants = require('./../constants');
var router = require('./../router');

var user = window.bootstrap.user;

// backbone collection
var BoardCollection = Backbone.Collection.extend({
  model: Board,
  get(id) {
    return this.find(function(board) {
      if(board.get('_id') == id) return true;
      return false;
    });
  },
  url() {
    var bevy_id = router.bevy_id;
    return constants.apiurl + '/bevies/' + bevy_id + '/boards';
  },
  filter: 'top'
});

module.exports = BoardCollection;
