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
var Post = require('./PostModel');

// backbone collection
module.exports = Backbone.Collection.extend({
	  model: Post
	, url: '/posts'
	, _meta: {
		sort: {
			  by: 'top'
			, direction: 'asc'
		}
	}
});
