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
var RaisedButton = mui.RaisedButton;
var FlatButton = mui.FlatButton;

var rbs = require('react-bootstrap');
var Button = rbs.Button;

var COMMENT = require('./../../constants').COMMENT;
var CommentActions = require('./../CommentActions');

var CommentSubmit = React.createClass({

	propTypes: {
		postId: React.PropTypes.string,
		commentId: React.PropTypes.string,
		author: React.PropTypes.object,
		bevy: React.PropTypes.object,
		onReply: React.PropTypes.func
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

		if(this.props.onReply)
			this.props.onReply();
	},

	onKeyPress: function(ev) {
	},

	onChange: function() {
		var body = this.refs.body.getValue();
		this.setState({
			body: body
		});
	},

	render: function() {

		var bevy = this.props.bevy;

		var user = window.bootstrap.user;
		var defaultProfileImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

		var profileImage = (user.image_url)
		? user.image_url
		: defaultProfileImage;

		var submitButton = (_.isEmpty(this.state.body)) 
		? 	<FlatButton
				className='submit-button'
				label='post'
				onClick={this.submit}
			/> 
		:	<RaisedButton
				className='submit-button'
				label='post'
				onClick={this.submit}
			/>

		if(_.isEmpty(window.bootstrap.user)) {
			return <div />;
		} else {
			return (<div className="panel-comment-input">
							<TextField
								className="panel-comment-textfield"
								hintText="Write a Comment"
								ref='body'
								multiLine={ true }
								value={ this.state.body }
								onKeyPress={ this.onKeyPress }
								onChange={ this.onChange }
							/>
							{submitButton}
						</div>);
		}
	}

});

module.exports = CommentSubmit;
