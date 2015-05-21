/**
 * CommentSubmit.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var mui = require('material-ui');
var IconButton = mui.IconButton;
var TextField = mui.TextField;

var rbs = require('react-bootstrap');
var Button = rbs.Button;

var COMMENT = require('./../../constants').COMMENT;
var CommentActions = require('./../CommentActions');

var CommentSubmit = React.createClass({

	propTypes: {
		postId: React.PropTypes.string,
		commentId: React.PropTypes.string,
		author: React.PropTypes.object,
		profileImage: React.PropTypes.string
	},

	getInitialState: function() {
		return {
			body: ''
		};
	},

	submit: function() {
		var post_id = this.props.postId;
		var comment_id = this.props.commentId;
		var author = window.bootstrap.user;
		var body = this.refs.body.getValue();

		if(comment_id)	// replying to a post
			CommentActions.create(post_id, author, body, comment_id);
		else // replying to a comment
			CommentActions.create(post_id, author, body);

		// clear text field
		this.setState({
			body: ''
		});
	},

	onKeyPress: function(ev) {
		if(ev.which == 13) { // enter key
			this.submit();
		}
	},

	onChange: function() {
		var body = this.refs.body.getValue();
		this.setState({
			body: body
		});
	},

	render: function() {

		return (<div className="panel-comment-input">
						<div className="profile-overlay"/>
						<div className='profile-img' style={{backgroundImage: 'url(' + this.props.profileImage + ')',}}/>
						<TextField
							className="panel-comment-textfield"
							hintText="Write a Comment"
							ref='body'
							value={ this.state.body }
							onKeyPress={ this.onKeyPress }
							onChange={ this.onChange }
						/>
					</div>);
	}

});

module.exports = CommentSubmit;
