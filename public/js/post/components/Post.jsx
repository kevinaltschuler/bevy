/**
 * Post.jsx
 * React class for an individual post
 * Created en masse by PostContainer.jsx
 * @author albert
 */

'use strict';

// imports
var React = require('react');
var _ = require('underscore');

var mui = require('material-ui');
var IconButton = mui.IconButton;
var TextField = mui.TextField;

var rbs = require('react-bootstrap');
var DropdownButton = rbs.DropdownButton;
var MenuItem = rbs.MenuItem;
var ModalTrigger = rbs.ModalTrigger;
var Button = rbs.Button;
var Badge = rbs.Badge;

var CommentList = require('./CommentList.jsx');
var CommentSubmit = require('./CommentSubmit.jsx');

var ImageModal  = require('./ImageModal.jsx');

var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');

var POST = require('./../../constants').POST;

var timeAgo = require('./../../shared/helpers/timeAgo');
var timeLeft = require('./../../shared/helpers/timeLeft');

var $ = require('jquery');

var user = window.bootstrap.user;
var email = user.email;

function getPostState(id) {
	return PostStore.getPost(id);
}

// React class
var Post = React.createClass({

	// expects (most) of these to be passed in by PostContainer.jsx
	propTypes: {
		id: React.PropTypes.string.isRequired,
		post: React.PropTypes.object,
		activeMember: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			isEditing: false,
			title: this.props.post.title
		};
	},

	onChange: function(ev) {
		this.setState({
			title: this.refs.title.getValue()
		});
	},

	upvote: function(ev) {
		ev.preventDefault();
		PostActions.upvote(this.props.post._id, this.props.post.author);
	},

	downvote: function(ev) {
		ev.preventDefault();
		PostActions.downvote(this.props.post._id, this.props.post.author);
	},

	destroy: function(ev) {
		ev.preventDefault();
		PostActions.destroy(this.props.post._id);
	},

	/**
	 * count the summed value of all of the votes
	 * for this post
	 * @return {int}
	 */
	countVotes: function() {
		var sum = 0;
		this.props.post.votes.forEach(function(vote) {
			sum += vote.score;
		});
		return sum;
	},

	findMember: function(user_id) {
		var members = this.props.post.bevy.members;
		return _.find(members, function(member) {
			if(member.user == user_id) return true;
			else return false;
		});
	},

	startEdit: function(ev) {
		ev.preventDefault();

		this.setState({
			isEditing: true
		});
	},

	stopEdit: function(ev) {
		ev.preventDefault();

		var postTitle = this.state.title;

		PostActions.update(this.props.post._id, postTitle);

		this.setState({
			isEditing: false
		});
	},

	pin: function(ev) {
		ev.preventDefault();

		var post_id = this.props.post._id;

		PostActions.pin(post_id);
	},

	render: function() {

		var defaultProfileImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';
		var profileImage = (this.props.post.author.image_url)
		 ? this.props.post.author.image_url
		 : defaultProfileImage;

		var author;
		author = 'placeholder-author';
		if(this.props.post.author) {
			if(this.props.post.author.google)
				author = this.props.post.author.google.name.givenName + ' ' + this.props.post.author.google.name.familyName;
			else
				author = this.props.post.author.email;
		}

		var authorMember = this.findMember(this.props.post.author._id);
		if(authorMember) {
			if(!_.isEmpty(authorMember.displayName)) author = authorMember.displayName;
		}

		var images = [];
		if(!_.isEmpty(this.props.post.images)) {
			var allImages = this.props.post.images;
			for(var key in allImages) {
				images.push(
					<div className='panel-body-image' key={ key } >
						<ModalTrigger modal={ <ImageModal allImages={ allImages } index={ key } /> } >
							<button className="image-thumbnail" style={{backgroundImage: 'url(' + this.props.post.images[key] + ')',}}/>
						</ModalTrigger>
					</div>
				);
			}
		}

		var panelBodyText;
		if(this.state.isEditing) {
			panelBodyText =
			(<div className='panel-body-text'>
				<TextField
					type='text'
					ref='title'
					defaultValue={ this.state.title  }
					value={ this.state.title  }
					placeholder=' '
					onChange={ this.onChange }
				/>
				<IconButton
					className="save-button"
					tooltip='save changes'
					onClick={ this.stopEdit }>
					<span className="glyphicon glyphicon-heart-empty"></span>
				</IconButton>
			</div>)
		} else {
			panelBodyText = (<div className='panel-body-text'>
								{ this.state.title  }
							</div>);
		}

		var commentList = (this.props.post.comments)
		? (<CommentList
				comments={ this.props.post.comments }
				post={ this.props.post }
			/>)
		: '';

		var commentCount = (this.props.post.comments)
		? this.props.post.comments.length
		: 0;

		var deleteButton = '';
		var activeMember = this.findMember(user._id);
		if(!_.isEmpty(activeMember)) {
			if(activeMember.role == 'admin' || this.props.post.author._id == user._id)
				deleteButton = (
					<MenuItem onClick={ this.destroy } >
						Delete Post
					</MenuItem>
				);
		}

		var editButton = '';
		if(!_.isEmpty(activeMember)) {
			if(activeMember.role == 'admin' || this.props.post.author._id == user._id)
				editButton = (
					<MenuItem onClick={ this.startEdit } >
						Edit Post
					</MenuItem>
				);
		}

		var pinButton = '';
		var pinButtonText = (this.props.post.pinned) ? 'Unpin Post' : 'Pin Post';
		if(!_.isEmpty(activeMember)) {
			if(activeMember.role == 'admin') {
				pinButton = (
					<MenuItem onClick={ this.pin }>
						{ pinButtonText }
					</MenuItem>
				);
			}
		}

		var pinnedBadge = (this.props.post.pinned)
		? <span className='badge pinned'>Pinned</span>
		: '';

		return <div className="post panel" postId={ this.props.post._id }>
					<div className='panel-header'>
						<div className='profile-img' style={{backgroundImage: 'url(' + profileImage + ')',}}/>
						<div className='post-details'>
							<div className='top'>
								<span className="details">{ author } </span>
								<span className="glyphicon glyphicon-triangle-right"/>
								<span className="details"> { this.props.post.bevy.name }</span>
							</div>
							<div className="bottom">
								<span className="detail-time">{ timeAgo(Date.parse(this.props.post.created)) } | </span>
								<span className='detail-time'>expires { timeLeft(Date.parse(this.props.post.expires)) }</span>
							</div>
						</div>
						<div className='badges'>
							<span className="points">{ this.countVotes() } Points</span>
							{ pinnedBadge }
						</div>
					</div>

				<div className='panel-body'>
					{ panelBodyText }
				</div>
				<div className='panel-body'>
					{ images }
				</div>

					<div className="panel-comments">
						<div className="comment-count">
							{ commentCount } Comments
						</div>

						{ commentList }

					</div>
					<div className="panel-bottom">

						<CommentSubmit
							postId={ this.props.id }
							author={ this.props.post.author }
						/>

						<div className="panel-controls-right">
							<IconButton tooltip='upvote' onClick={ this.upvote }>
								<span className="glyphicon glyphicon-menu-up btn"></span>
							</IconButton>
							<IconButton tooltip='downvote' onClick={ this.downvote }>
								<span className="glyphicon glyphicon-menu-down btn"></span>
							</IconButton>
							<DropdownButton
								noCaret
								pullRight
								className="post-settings"
								title={<span className="glyphicon glyphicon-option-vertical btn"></span>}>
								{ deleteButton }
								{ editButton }
								{ pinButton }
							</DropdownButton>
						</div>
					</div>
				</div>;
	}
});

module.exports = Post;
