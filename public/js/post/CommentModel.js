/**
 * CommentModel.js
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

// backbone model
var Comment = Backbone.Model.extend({
  defaults: {
    _id: null,
    postId: null,
    parentId: null,
    author: null,
    body: '',
    comments: [],
    created: new Date(),
    updated: new Date(),
  },
});

module.exports = Comment;
