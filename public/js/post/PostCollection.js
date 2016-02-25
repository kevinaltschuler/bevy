/**
 * PostCollection.js
 *
 * post backbone collection
 * really just a fancy array with some CRUD functions
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');
var router = require('./../router');

var Post = require('./PostModel');
var constants = require('./../constants');

var user = window.bootstrap.user;

var PostCollection = Backbone.Collection.extend({
  model: Post,

  initialize() {
  },

  nestComments() {
    this.forEach(function(post) {
      post.updateComments();
    });
  }
});

module.exports = PostCollection;
