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
  idAttribute: '_id',

  initialize() {
    this.on('sync', function() {
      this.nestComments();
    });
  },

  sync(method, model, options) {
    if(method != 'read' && router.current == 'search') {
      var bevy_id = model.get('bevy')._id;
      model.url = constants.apiurl + '/bevies/' + bevy_id + '/posts/' + model.id;
    }
    Backbone.Model.prototype.sync.apply(this, arguments);
  },

  countVotes() {
    var sum = 0;
    this.get('votes').forEach(function(vote) {
      sum += vote.score;
    });
    return sum;
  },

  nestComments() {
    var comments = this.get('comments');
    // create deep clone to avoid reference hell
    comments = _.map(comments, function(comment) {
      return comment;
    });

    this.set('allComments', comments);
    this.set('commentCount', comments.length);

    // recurse through comments
    this.set('comments', this.recursiveNestComments(comments));
  },

  recursiveNestComments(comments, parentId, depth) {
    // increment depth (used for indenting later)
    if(typeof depth === 'number') depth++;
    else depth = 1;

    // return if it's the end of the line
    if(comments.length < 0) return [];

    var $comments = [];
    comments.forEach(function(comment, index) {
      // look for comments under this one
      if(comment.parentId == parentId) {
        comment.depth = depth;
        // and keep going
        comment.comments = this.recursiveNestComments(comments, comment._id, depth);
        $comments.push(comment);
        // TODO: splice the matched comment out of the list so we can go faster
      }
    }.bind(this));

    return $comments;
  },

  removeComment(comment_id) {
    var comments = this.get('allComments');
    var comments_to_remove = this._removeComment(comment_id, comments);
    comments_to_remove.push(comment_id);

    comments = _.reject(comments, $comment => {
      return _.contains(comments_to_remove, $comment._id);
    });
    this.set('comments', comments);
    this.nestComments();
  },

  _removeComment(comment_id, list) {
    var to_remove = _.where(list, { parentId: comment_id });
    for(var key in to_remove) {
      var $comment = to_remove[key];
      _.union(to_remove, this._removeComment($comment._id, list));
    }
    return to_remove;
  }
});

module.exports = Post;
