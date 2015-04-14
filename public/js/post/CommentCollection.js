/**
 * CommentCollection.js
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var Comment = require('./CommentModel');

// backbone collection
var CommentCollection = Backbone.Collection.extend({
	model: Comment
});

module.exports = CommentCollection;
