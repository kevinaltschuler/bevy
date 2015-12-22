/**
 * BoardModel.js
 *
 * Backbone model for Boards
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');

var constants = require('./../constants');

// backbone model
var BoardModel = Backbone.Model.extend({
  defaults: {
    name: null,
    description: null,
    parents: [],
    image: {},
    admins: [],
    settings: {},
    created: 0,
    updated: 0,
    subCount: 0,
  },
  idAttribute: '_id'
});

module.exports = BoardModel;
