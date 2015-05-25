/**
 * CommentList.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var CommentItem = require('./CommentItem.jsx');

var CommentList = React.createClass({

	propTypes: {
		comments: React.PropTypes.array,
		post: React.PropTypes.object,
	},

	getInitialState: function() {
		return {};
	},

	render: function() {

		var allComments = this.props.comments
		var comments = [];
		for(var key in allComments) {
			var comment = allComments[key];
			comments.push(
				<CommentItem
					key={ comment._id }
					index={ key }
					comment={ comment }
					post={ this.props.post }
				/>
			);
		}

		return (<div>{ comments }</div>)
	}

});

module.exports = CommentList;
