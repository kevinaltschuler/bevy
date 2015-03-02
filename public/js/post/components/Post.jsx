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

var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');

var POST = require('./../../constants').POST;

var $ = require('jquery');

function getPostState(id) {
	return PostStore.getPost(id);
}

// React class
var Post = React.createClass({

	// expects (most) of these to be passed in by PostContainer.jsx
	propTypes: {
		  id: ReactPropTypes.number.isRequired
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
		PostActions.upvote(this.state.id, this.state.author);
	},

	downvote: function(ev) {
		ev.preventDefault();
		PostActions.downvote(this.state.id, this.state.author);
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
	timeAgo: function() {
		var created = this.state.created;
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

	render: function() {
		// generate panel
		var panelHeading;
		if(_.isEmpty(this.state.image_url)) {
			panelHeading = <div className='panel-header'>{ this.state.title }</div>;
		} else {
			panelHeading = <div className='panel-header'>
				<a href={ this.state.image_url } title={ this.state.title }>{ this.state.title }</a>
			</div>;
		}

		var panelBody;
		if(_.isEmpty(this.state.image_url)) {
			panelBody = <div className="panel-body panel-body-text" tabIndex="0" >whatever you wrote
							</div>;

		} else {
			panelBody = <div className="panel-body" tabIndex="0">
								<img className="panel-media" src={ this.state.image_url }/>
							</div>;
		}

		return	<div className="post panel" postId={ this.state.id }>
						{ panelHeading }
						<div className="panel-details">{ this.state.author } • { this.state.bevy } • { this.timeAgo() }</div>
						{ panelBody }
						<div className="panel-commments"></div>
						<div className="panel-bottom">
							<div className="panel-controls-left">
								{ this.countVotes() } points<br/>{ this.state.comments.length } comments
							</div>
							<div className="panel-controls-right">
								<IconButton tooltip='upvote' onClick={ this.upvote }>
									<span className="glyphicon glyphicon-menu-up btn"></span>
								</IconButton>
								<IconButton tooltip='downvote' onClick={ this.downvote }>
									<span className="glyphicon glyphicon-menu-down btn"></span>
								</IconButton>
								<span className="glyphicon glyphicon-option-vertical btn"></span>
							</div>
						</div>
					</div>;
	}
});

module.exports = Post;
