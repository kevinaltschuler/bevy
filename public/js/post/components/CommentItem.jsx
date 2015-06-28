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

		var allComments = this.props.comments;
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
			<div className="comment-list">
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
			isReplying: false,
			collapsed: false
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

	onCollapse: function(ev) {
		this.setState({
			collapsed: !this.state.collapsed
		});
	},

	findMember: function(user_id) {
		var members = this.props.post.bevy.members;
		return _.find(members, function(member) {
			if(!_.isObject(member.user)) return false;
			return user_id == member.user._id;
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

		var profileImage = (author.image_url)
		? author.image_url
		: defaultProfileImage;

		var authorMember = this.findMember(author._id);
		if(authorMember) {
			if(!_.isEmpty(authorMember.displayName) && this.props.post.bevy.settings.anonymise_users)
				authorName = authorMember.displayName;
			if(bevy.settings.anonymise_users && !_.isEmpty(authorMember.image_url))
				profileImage = authorMember.image_url;
		}

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
				<span className="glyphicon glyphicon-remove btn" onClick={ this.destroy }></span>);

		var collapseBody = (this.state.collapsed)
		? (<div className="comment">
				<div className='comment-col' >
					<span className="comment-name collapsed">{ authorName }</span>
					<span>&nbsp;</span>
					<span className="detail-time collapsed">{ timeAgo(Date.parse(comment.created)) }</span>
					<div className="comment-actions">
						<span className="glyphicon glyphicon-plus btn" onClick={this.onCollapse}></span>
						<span className="glyphicon btn" onClick={this.onCollapse}></span>
					</div>
				</div>

			</div>)
		: (<div className="comment">
				<div className='comment-col' >
					<div className='profile-img' style={{backgroundImage: 'url(' + profileImage + ')',}}/>
					<div className="comment-text">
						<div className="comment-title">
							<a className="comment-name">{ authorName }</a>
							<span>&nbsp;</span>
							<text className="detail-time">{ timeAgo(Date.parse(comment.created)) }</text>
						</div>
						<div className="comment-body">{ comment.body }</div>
						<a className="reply-link" href="#" onClick={ this.onReply }>{ replyText }</a>
					</div>
					<div className="comment-actions">
						<span className="glyphicon glyphicon-minus btn" onClick={this.onCollapse}></span>
						{ deleteButton }
					</div>
				</div>
				<div className='comment-submit'>
					{ submit }
				</div>
				<div className='comment-list'>
					{ commentList }
				</div>
			</div>);

		return (
			<div>
				{ collapseBody }
			</div>
		);
	}

});

module.exports = CommentItem;
