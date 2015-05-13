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

var CommentList = require('./CommentList.jsx');
var CommentSubmit = require('./CommentSubmit.jsx');

var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');

var POST = require('./../../constants').POST;

var timeAgo = require('./../../shared/helpers/timeAgo');

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
		post: React.PropTypes.object
	},

	defaults: {
		// no need to set these, as they've already been set
		// by PostActions.js
	},

	getInitialState: function() {
		return {};
	},

	componentDidMount:function() {
		PostStore.on(POST.CHANGE_ONE, this._onPostChange);
	},
	componentWillUnmount: function() {
		PostStore.off(POST.CHANGE_ONE, this._onPostChange);
	},

	_onPostChange: function() {
		this.setState(getPostState(this.props.id));
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
		this.props.post.points.forEach(function(vote) {
			sum += vote.value;
		});
		return sum;
	},

	expand: function(ev) {
		ev.preventDefault();

		var parent = $(ev.target).parent();
		if(parent.hasClass('focus')) parent.removeClass('focus');
		else parent.addClass('focus');
	},

	render: function() {

		var defaultProfileImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';
		var profileImage = (_.isEmpty(user.google.photos))
		 ? defaultProfileImage
		 : user.google.photos[0].value;

		var author;
		author = 'placeholder-author';
		if(this.props.post.author) {
			//console.log(this.props.post.title, this.props.post.author);
			///author = this.props.post.author.name;
			author = this.props.post.author.google.name.givenName + ' ' + this.props.post.author.google.name.familyName
		}

		var postTitle = (<span>{ this.props.post.title } &nbsp; </span>)

		var panelBody = (_.isEmpty(this.props.post.image_url))
		? (<div className='panel-body'>
				{ postTitle }
			</div>)
		: (<div className='panel-body'>
				{ postTitle }
				<div className='panel-body-image' onClick={ this.expand }>
					<img className="panel-media" src={ this.props.post.image_url }/>
				</div>
			</div>)

		return <div className="post panel" postId={ this.props.post._id }>
					<div className='panel-header'>
						<span className="details">{ author } </span> &nbsp;
						<span className="glyphicon glyphicon-triangle-right"/>&nbsp;
						<span className="details">{ this.props.post.bevy.name }</span>
						<span className="dot">&nbsp; • &nbsp;</span>
						<span className="detail-time">{ timeAgo(Date.parse(this.props.post.created)) }</span>
					</div>

					{ panelBody }

					<div className="panel-comments">
						<div className="comment-count">
							{ this.props.post.comments.length } Comments
							•&nbsp;
							{ this.countVotes() } points
						</div>

						<CommentList
							comments={ this.props.post.comments }

							postId={ this.props.id }
							author={ this.props.post.author }
							profileImage={ profileImage }
						/>

					</div>
					<div className="panel-bottom">

						<CommentSubmit
							postId={ this.props.id }
							author={ this.props.post.author }
							profileImage={ profileImage }
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
								<MenuItem
									onClick={ this.destroy }
									>Delete Post</MenuItem>
							</DropdownButton>

						</div>
					</div>
				</div>;
	}
});

module.exports = Post;
