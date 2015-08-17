/**
 * PostModel.js
 *
 * post backbone model
 * corresponds (hopefully) with the mongoose model
 * in models/Post.js
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var router = require('./../router');
var constants = require('./../constants');

var BevyStore = require('./../bevy/BevyStore');

var constants = require('./../constants');
var POST = constants.POST;

// backbone model
var Post = Backbone.Model.extend({
  defaults: {
    _id: null,
    images: [],
    author: null,
    bevy: null,
    votes: [],
    type: 'default',
    event: null,
    allComments: [],
    commentCount: 0,
    created: new Date(),
    updated: new Date(),
  },

  initialize() {
    //var bevy = BevyStore.getBevy(this.get('bevy'));
    //this.set('bevy', bevy);

    this.on('sync', function(model, response, options) {
      //var bevy = BevyStore.getBevy(this.get('bevy'));
      //this.set('bevy', bevy);

      var PostStore = require('./PostStore');

      PostStore.postsNestComment(this);

      PostStore.trigger(POST.CHANGE_ONE + this.id);

    }.bind(this));
  },

  sync(method, model, options) {

    if(method != 'read' && router.bevy_id == -1 && router.current == 'bevy') {
      var bevy_id = model.get('bevy');
      if(method == 'create')
        model.url = constants.apiurl + '/bevies/' + bevy_id + '/posts/';
      else
        model.url = constants.apiurl + '/bevies/' + bevy_id + '/posts/' + model.id;
    }

    if(method != 'read' && router.current == 'search') {
      var bevy_id = model.get('bevy')._id;
      model.url = constants.apiurl + '/bevies/' + bevy_id + '/posts/' + model.id;
    }

    Backbone.Model.prototype.sync.apply(this, arguments);
  },

  idAttribute: '_id',

  countVotes() {
    var sum = 0;
    this.get('votes').forEach(function(vote) {
      sum += vote.score;
    });
    return sum;
  }
});

module.exports = Post;
