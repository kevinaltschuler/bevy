/**
 * Post.jsx
 * React class for an individual post
 * Created en masse by PostContainer.jsx
 * @author albert
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
		id: ReactPropTypes.string.isRequired
	},

	defaults: {
		// no need to set these, as they've already been set
		// by PostActions.js
	},

	getInitialState: function() {
		return getPostState(this.props.id);
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
		PostActions.upvote(this.state._id, this.state.author);
	},

	downvote: function(ev) {
		ev.preventDefault();
		PostActions.downvote(this.state._id, this.state.author);
	},

	destroy: function(ev) {
		ev.preventDefault();
		PostActions.destroy(this.state._id);
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
		if(this.state.author) {
			//console.log(this.state.title, this.state.author);
			author = this.state.author.name;
		}

		var postTitle = (_.isEmpty(this.state.image_url))
		? (<span>{ this.state.title } &nbsp; </span>)
		: (<a
				href={ this.state.image_url }
				title={ this.state.title }
				target='_blank' >
				{ this.state.title } &nbsp;
			</a>)

		var bodyText = (_.isEmpty(this.state.body))
		? (<div />)
		: (<div className='panel-body-text'>
				{ this.state.body }
			</div>)

		var panelBody = (_.isEmpty(this.state.image_url))
		? (<div className='panel-body'>
				{ bodyText }
			</div>)
		: (<div className='panel-body'>
				<div className='panel-body-image' onClick={ this.expand }>
					<img className="panel-media" src={ this.state.image_url }/>
				</div>
				{ bodyText }
			</div>)

		return <div className="post panel" postId={ this.state._id }>
					<div className='panel-header'>
						{ postTitle }
						<span className="glyphicon glyphicon-triangle-right"/> &nbsp;
						<a className="details" href='/'>{ this.state.bevy.name }</a>
						<span className="dot">&nbsp; • &nbsp;</span>
						<a className="details" href='/'>{ author } </a>
						<span className="dot">&nbsp; • &nbsp;</span>
						<a className="detail-time">{ timeAgo(Date.parse(this.state.created)) }</a>
					</div>

					{ panelBody }

					<div className="panel-comments">
						<div className="comment-count">
							{ this.state.comments.length } Comments
							•&nbsp;
							{ this.countVotes() } points
						</div>

						<CommentList
							comments={ this.state.comments }
						/>

					</div>
					<div className="panel-bottom">

						<CommentSubmit
							author={ this.state.author }
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
