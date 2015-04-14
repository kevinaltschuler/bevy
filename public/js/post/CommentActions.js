/**
 * CommentActions.jsx
 *
 * @author albert
 */

'use strict';

// imports
var dispatch = require('./../shared/helpers/dispatch');

var COMMENT = require('./../constants').COMMENT;

var CommentActions = {

	create: function(author, body) {
		dispatch(COMMENT.CREATE, {
			author: (author == undefined) ? null : author,
			body: (body == undefined) ? null : body
		});
	},

	destroy: function() {
		dispatch(COMMENT.DESTROY, {

		});
	},

	vote: function() {
		dispatch(COMMENT.VOTE, {

		});
	}
}

module.exports = CommentActions;
