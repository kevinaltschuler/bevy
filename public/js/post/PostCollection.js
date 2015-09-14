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

// backbone collection
var PostCollection = Backbone.Collection.extend({
  model: Post,

  initialize() {
    this.allPostsLoaded = false;
  },

  sync(method, model, options) {
    Backbone.Collection.prototype.sync.apply(this, arguments); //continue using backbone's collection sync
  },

  url() {

    var bevy_id = router.bevy_id;
    
    if((router.current == 'front')) // frontpage
      return constants.apiurl + '/users/' + user._id + '/frontpage';

    if(router.current == 'search' && !_.isEmpty(router.search_query))
      return constants.apiurl + '/users/' + user._id + '/posts/search/' + router.search_query;

    return constants.apiurl + '/bevies/' + bevy_id + '/posts';
  }
});

module.exports = PostCollection;