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
  url: function() {
    return constants.apiurl + '/users/' + user._id + '/threads';
  }
});

module.exports = ThreadCollection;
