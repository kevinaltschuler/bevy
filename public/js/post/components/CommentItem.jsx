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
		activeMember: React.PropTypes.object,
		members: React.PropTypes.array,
		activeBevy: React.PropTypes.object
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

	findMember: function(user_id) {
		var members = this.props.members;
		return _.find(members, function(member) {
			if(member.user == user_id) return true;
			else return false;
		});
	},

	render: function() {

		var defaultProfileImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

		var comment = this.props.comment;
		var author = comment.author;

		//console.log(author);
		var authorName = author.displayName;

		var authorMember = this.findMember(author._id);
		if(authorMember) {
			if(!_.isEmpty(authorMember.displayName) && this.props.activeBevy.settings.allow_changeable_names)
				authorName = authorMember.displayName;
		}

		var profileImage = (author.image_url)
		? author.image_url
		: defaultProfileImage;

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
		var activeMember = this.findMember(user._id);
		if(activeMember.role == 'admin' || comment.author._id == user._id)
			deleteButton = (
				<MenuItem onClick={ this.destroy } >
					Delete Comment
				</MenuItem>);

		//console.log(comment.author._id, user._id, (comment.author._id == user._id));

		return (<div className="row comment">
					<div className='col-xs-10'>
						<div className='profile-img' style={{backgroundImage: 'url(' + profileImage + ')',}}/>
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
