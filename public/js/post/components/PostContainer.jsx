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
var CTG = React.addons.CSSTransitionGroup;

var router = require('./../../router');

var Post = require('./Post.jsx');
var Event = require('./Event.jsx');
var PostStore = require('./../PostStore');


// React class
var PostContainer = React.createClass({

	// expects App.jsx to pass in Posts collection
	// see App.jsx and PostStore.js for more details
	propTypes: {
		allPosts: React.PropTypes.array,
		sortType: React.PropTypes.string
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

	componentWillRecieveProps: function(nextProps) {
		console.log('rerendring');
		this.forceUpdate();
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
		var sortType = this.props.sortType;

		// for each post
		for(var key in allPosts) {
			var post = allPosts[key];
			// load post into array
			switch(post.type) {
				case 'event':
					if(sortType == 'events') {
						posts.push(
							<Event
								id={ post._id }
								key={Math.random()}
								post={ post }
							/>
						);
					}
					break;
				default:
					if(sortType != 'events') {
						posts.push(
							<Post
								id={ post._id }
								key={Math.random()}
								post={ post }
							/>
						);
					}
					break;
			}
		}

		return (<div className='post-container'>
					<CTG transitionName="fadeIn">
						{posts}
					</CTG>
				</div>
		);
	}
});

// pipe back to App.jsx
module.exports = PostContainer;
