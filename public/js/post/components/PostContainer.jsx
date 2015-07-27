/**
 * PostContainer.jsx
 * React Component that manages and wraps around
 * Post panels
 * @author albert
 */

'use strict';

// imports
var React = require('react');
var _ = require('underscore');

var router = require('./../../router');

var Post = require('./Post.jsx');
var Event = require('./Event.jsx');
var PostStore = require('./../PostStore');


// React class
var PostContainer = React.createClass({

	// expects App.jsx to pass in Posts collection
	// see App.jsx and PostStore.js for more details
	propTypes: {
		allPosts: React.PropTypes.array
	},

	getInitialState: function() {
		return {};
	},

	componentDidUpdate: function() {
		var post_id = router.post_id;
		if(post_id) {
			var post = document.getElementById('post:' + post_id);
			if(post)
				post.scrollIntoView();
		}
	},

	render: function() {

		if(Object.keys(this.props.allPosts).length < 1) {
			// no posts
			// still return column so the app retains its structure
			return(
				<div className="col-xs-6 post-container">
					Nothing to see here...
				</div>
			);
		}

		// load props into local vars
		var allPosts = this.props.allPosts;
		var posts = [];

		// for each post
		for(var key in allPosts) {
			var post = allPosts[key];
			// load post into array
			if(((router.bevy_id == -1) && post.pinned)) {
				continue;
			}
			if(_.isEmpty(post.event)) {
				posts.push(
					<Post
						id={ post._id }
						key={ post._id }
						post={ post }
					/>
				);
			} else {
				posts.push(
					<Event
						id={ post._id }
						key={ post._id }
						post={ post }
					/>
				);
			}
		}

		return (
			<div className='post-container'>
				{posts}
			</div>
		);
	}
});

// pipe back to App.jsx
module.exports = PostContainer;
