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
//var CommentList = require('./CommentList.jsx');

var CommentActions = require('./../CommentActions');

var user = window.bootstrap.user;

var CommentList = React.createClass({

	propTypes: {
		comments: React.PropTypes.array,
		post: React.PropTypes.object,
		activeMember: React.PropTypes.object
	},

	render: function() {

		var allComments = this.props.comments
		var comments = [];
		allComments.forEach(function(comment, index) {
			comments.push(
				<CommentItem
					key={ index }
					comment={ comment }
					post={ this.props.post }
					activeMember={ this.props.activeMember }
				/>
			);
		}.bind(this));

		return (
			<div>
				{ comments }
			</div>);
	}

});

var CommentItem = React.createClass({

	propTypes: {
		comment: React.PropTypes.object.isRequired,
		post: React.PropTypes.object.isRequired,
		activeMember: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			isReplying: false
		};
	},

	onReply: function(ev) {
		if(ev)
			ev.preventDefault();

		this.setState({
			isReplying: !this.state.isReplying
		});
	},

	destroy: function(ev) {
		ev.preventDefault();
		CommentActions.destroy(this.props.post._id, this.props.comment._id);
	},

	findMember: function(user_id) {
		var members = this.props.post.bevy.members;
		return _.find(members, function(member) {
			return user_id == member.user;
		});
	},

	render: function() {

		var defaultProfileImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

		var comment = this.props.comment;
		var author = comment.author;
		var bevy = this.props.post.bevy;
		var post = this.props.post;
		var activeMember = this.findMember(user._id);

		var authorName = author.displayName || 'placeholder author';

		var authorMember = this.findMember(author._id);
		if(authorMember) {
			if(!_.isEmpty(authorMember.displayName) && this.props.post.bevy.settings.anonymise_users)
				authorName = authorMember.displayName;
		}

		var profileImage = (author.image_url)
		? author.image_url
		: defaultProfileImage;

		if(bevy.settings.anonymise_users && !_.isEmpty(activeMember.image_url))
			profileImage = activeMember.image_url;

		var replyText = (this.state.isReplying)
		? 'close'
		: 'reply';

		var submit = (this.state.isReplying)
		? (<CommentSubmit
				postId={ post._id }
				commentId={ comment._id }
				author={ post.author }
				activeMember={ activeMember }
				bevy={ bevy }
				onReply={ this.onReply }
			/>)
		: <div />;

		var commentList = (!_.isEmpty(comment.comments))
		? (<CommentList
				comments={ comment.comments }
				post={ post }
				activeMember={ activeMember }
			/>)
		: '';

		var deleteButton = '';
		var activeMember = this.findMember(user._id);
		if(activeMember.role == 'admin' || comment.author._id == user._id)
			deleteButton = (
				<MenuItem onClick={ this.destroy } >
					Delete Comment
				</MenuItem>);

		return (
			<div className="row comment">
				<div className='col-xs-10'>
					<div className='profile-img' style={{backgroundImage: 'url(' + profileImage + ')',}}/>
					<div className="comment-text">
						<div className="comment-title">
							<a className="comment-name">{ authorName }</a>
							<span>&nbsp;</span>
							<text className="detail-time">{ timeAgo(Date.parse(comment.created)) }</text>
						</div>
						<div className="comment-body">{ comment.body }</div>
						depth: {comment.depth}
						<a className="reply-link" href="#" onClick={ this.onReply }>{ replyText }</a>
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
				<div className='col-xs-12'>
					{ commentList }
				</div>
				<div className='col-xs-12'>
					{ submit }
				</div>
			</div>
		);
	}

});

module.exports = CommentItem;
