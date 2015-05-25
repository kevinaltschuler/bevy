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

		postId: React.PropTypes.string,
		author: React.PropTypes.object,
		activeMember: React.PropTypes.object,
		members: React.PropTypes.array,
		activeBevy: React.PropTypes.object
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

					postId={ this.props.postId }
					author={ this.props.author }
					activeMember={ this.props.activeMember }
					members={ this.props.members }
					activeBevy={ this.props.activeBevy }
				/>
			);
		}

		return (<div>{ comments }</div>)
	}

});

module.exports = CommentList;
