/**
 * BevyModel.js
 *
 * Backbone model for Bevies
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');

var constants = require('./../constants');

// backbone model
var BevyModel = Backbone.Model.extend({
  idAttribute: '_id'
});

module.exports = BevyModel;
