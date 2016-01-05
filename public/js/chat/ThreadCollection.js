/**
 * ThreadCollection.js
 *
 * @author albert
 */

'use strict';

var Backbone = require('backbone');
var ThreadModel = require('./ThreadModel');

var constants = require('./../constants');
var user = window.bootstrap.user;

var ThreadCollection = Backbone.Collection.extend({
  model: ThreadModel,
  comparator: 'type',
  url: function() {
    return constants.apiurl + '/threads';
  }
});

module.exports = ThreadCollection;
