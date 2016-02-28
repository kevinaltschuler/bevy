/**
 * BoardCollection.js
 * Backbone collection for boards
 * @author kevin
 */

'use strict';

// imports
var Backbone = require('backbone');

var Board = require('./BoardModel');
var constants = require('./../constants');
var router = require('./../router');
var BevyStore = require('./../bevy/BevyStore');

var user = window.bootstrap.user;

// backbone collection
var BoardCollection = Backbone.Collection.extend({
  model: Board
});

module.exports = BoardCollection;
