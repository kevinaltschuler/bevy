/**
 * CommentItem.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var DropdownButton = rbs.DropdownButton;
var MenuItem = rbs.MenuItem;

var timeAgo = require('./../../shared/helpers/timeAgo');

var CommentSubmit = require('./CommentSubmit.jsx');

var CommentActions = require('./../CommentActions');

var user = window.bootstrap.user;

var CommentItem = React.createClass({

	propTypes: {
		index: React.PropTypes.string,
		comment: React.PropTypes.object,

		postId: React.PropTypes.string,
		author: React.PropTypes.object,
		profileImage: React.PropTypes.string,
		activeMember: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			isReplying: false
		};
	},

	onReply: function(ev) {
		ev.preventDefault();

		this.setState({
			isReplying: !this.state.isReplying
		});
	},

	destroy: function(ev) {
		ev.preventDefault();
		CommentActions.destroy(this.props.postId, this.props.comment._id);
	},

	render: function() {

		var defaultAliasImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

		var comment = this.props.comment;
		var author = comment.author;
		var authorName = (author.google)
		? author.google.name.givenName + ' ' + author.google.name.familyName
		: author.email;

		var replyText = (this.state.isReplying)
		? 'close'
		: 'reply';

		var submit = (this.state.isReplying)
		? (<CommentSubmit
				postId={ this.props.postId }
				commentId={ comment._id }
				author={ this.props.author }
				profileImage={ this.props.profileImage }
			/>)
		: <div />;

		var deleteButton = '';
		if(!_.isEmpty(this.props.activeMember)) {
			if(this.props.activeMember.role == 'admin' || comment.author._id == user._id)
				deleteButton = (
					<MenuItem onClick={ this.destroy } >
						Delete Comment
					</MenuItem>);
		}

		//console.log(comment.author._id, user._id, (comment.author._id == user._id));

		return (<div className="row comment">
					<div className='col-xs-10'>
						<img className="profile-img" src={ defaultAliasImage }/>
						<div className="comment-text">
							<div className="comment-title">
								<a className="comment-name">{ authorName }</a>
								<span>&nbsp;</span>
								<text className="detail-time">{ timeAgo(Date.parse(comment.created)) }</text>
							</div>
							<div className="comment-body">{ comment.body }</div>
							{/*<a className="reply-link" onClick={ this.onReply }>{ replyText }</a>*/}
						</div>
					</div>
					<div className='col-xs-2'>
						<DropdownButton
							noCaret
							pullRight
							className=""
							title={<span className="glyphicon glyphicon-option-vertical btn"></span>}>

							{ deleteButton }

						</DropdownButton>
					</div>
					{ submit }
				 </div>)
	}

});

module.exports = CommentItem;
