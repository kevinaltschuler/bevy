/**
 * savedpostsitem.jsx
 * @author Kevin
 */

'use strict';

// imports
var React = require('react');
var ReactPropTypes = React.PropTypes;
var _ = require('underscore');

var mui = require('material-ui');
var IconButton = mui.IconButton;
var TextField = mui.TextField;

var rbs = require('react-bootstrap');
var DropdownButton = rbs.DropdownButton;
var MenuItem = rbs.MenuItem;

var PostActions = require('./../../post/PostActions');
var PostStore = require('./../../post/PostStore');

var $ = require('jquery');

var user = window.bootstrap.user;
var email = user.email;

//function getPostState(id) {
//	return PostStore.getPost(id);
//}

// React class
var SavedPostsItem = React.createClass({

	// expects (most) of these to be passed in by PostContainer.jsx
	propTypes: {
		id: ReactPropTypes.string.isRequired
	},

	defaults: {
		// no need to set these, as they've already been set
		// by PostActions.js
	},

	upvote: function(ev) {
		ev.preventDefault();
		//PostActions.upvote(this.state._id, this.state.author);
	},

	downvote: function(ev) {
		ev.preventDefault();
		//PostActions.downvote(this.state._id, this.state.author);
	},

	destroy: function(ev) {
		ev.preventDefault();
		//PostActions.destroy(this.state._id);
	},

	/**
	 * count the summed value of all of the votes
	 * for this post
	 * @return {int}
	 */
	countVotes: function() {
		var sum = 0;
		this.state.points.forEach(function(vote) {
			sum += vote.value;
		});
		return sum;
	},

	/**
	 * calculates how long ago
	 * this post was posted
	 * @return {string}
	 */
	/*timeAgo: function() {
		var now = Date.now();
		var elapsed = now - created;

		if(elapsed <= 1000*10) {
			return 'just now';

		} else if (elapsed <= 1000*60) {
			var seconds = Math.floor(elapsed / 1000);
			//return (seconds > 1) ? seconds + ' seconds ago' : seconds + ' second ago';
			return 'a few seconds ago';

		} else if (elapsed <= 1000*60*60) {
			var minutes = Math.floor(elapsed / (1000*60));
			return (minutes > 1) ? minutes + ' minutes ago' : minutes + ' minute ago';

		} else if (elapsed <= 1000*60*60*24) {
			var hours = Math.floor(elapsed / (1000*60*60));
			return (hours > 1) ? hours + ' hours ago' : hours + ' hour ago';

		} else if (elapsed <= 1000*60*60*24*30) {
			var days = Math.floor(elapsed / (1000*60*60*24));
			return (days > 1) ? days + ' days ago' : days + ' day ago';

		} else if (elapsed <= 1000*60*60*24*365) {
			var months = Math.floor(elapsed / (1000*60*60*24*30));
			return (months > 1) ? months + ' months ago' : months + ' month ago';

		} else if (elapsed > 1000*60*60*24*365) {
			var years = Math.floor(elapsed / (1000*60*60*24*365));
			return (years > 1) ? years + ' years ago' : years + ' year ago';

		} else {
			return elapsed;
		}
	},
	*/

	render: function() {

		var defaultProfileImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';
		var profileImage = (_.isEmpty(user.google.photos))
		 ? defaultProfileImage
		 : user.google.photos[0].value;

		var placeholderImage = "http://i.imgur.com/V9gzxMw.jpg"

		var author;
		author = 'placeholder-author';
		//if(this.state.author) {
			//console.log(this.state.author);
		//	author = this.state.author.name;
		//}

		// generate panel
		var panelHeading;
			panelHeading = <div className='panel-header'>
									<a href={ placeholderImage } title="{ this.state.title }">title</a>
									&nbsp;
									<span className="glyphicon glyphicon-triangle-right"/>
									<a className="details" href='/'>placeholder bevy</a>
									&nbsp;•&nbsp;
									<a className="details" href='/'>{ author }</a>
								</div>;

		var panelBody;
			panelBody = <div className="panel-body" tabIndex="0">
								<img className="panel-media" src={ placeholderImage }/>
							</div>;


		return	<div className="post panel">
						{ panelHeading }
						{ panelBody }
						<div className="panel-comments">
							<div className="comment-count">3 Comments</div>
							<div className="row comment">
								<img className="profile-img" src={ profileImage }/>
								<div className="comment-text">
									<div className="comment-title">
										<a className="comment-name">Lisa Ding </a>
										<text className="detail-time">12 hours</text>
									</div>
									<div className="comment-body">Yo bro this is so sick!</div>
									<a className="reply-link">reply</a>
								</div>
							</div>
						</div>
						<div className="panel-bottom">
							<div className="panel-controls-left">
								ph points<br/>ph comments
								<div className="profile-btn"/>
							</div>
							<div className="panel-comment-input">
								<div className="profile-overlay"/>
								<img className="profile-img" src={ profileImage }/>
								<TextField className="panel-comment-textfield" hintText="Write a Comment"/>
							</div>
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
									<MenuItem
										onClick={ this.destroy }
										>Delete Post</MenuItem>
								</DropdownButton>
							</div>
						</div>
					</div>;
	}
});

module.exports = SavedPostsItem;
