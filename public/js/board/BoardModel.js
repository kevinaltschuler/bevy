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
  idAttribute: '_id'
});

module.exports = BoardModel;
