/**
 * PostContainer.jsx
 * React Component that manages and wraps around
 * Post panels
 * @author albert
 */

'use strict';

// imports
var React = require('react');
var ReactPropTypes = React.PropTypes;

var Post = require('./Post.jsx');
var PostStore = require('./../PostStore');


// React class
var PostContainer = React.createClass({

	// expects App.jsx to pass in Posts collection
	// see App.jsx and PostStore.js for more details
	propTypes: {
		allPosts: ReactPropTypes.array.isRequired
	},

	getInitialState: function() {
		return {};
	},

	render: function() {

		if(Object.keys(this.props.allPosts).length < 1) {
			// no posts
			// still return column so the app retains its structure
			return	<div className="col-xs-6">
							Nothing to see here...
						</div>;
		}

		// load props into local vars
		var allPosts = this.props.allPosts;
		var posts = [];

		// for each post
		for(var key in allPosts) {
			var post = allPosts[key];
			// load post into array
			posts.push(<Post title = { post.title }
				body = { post.body } image_url = { post.image_url }
				author = { post.author } bevy = { post.bevy } />);
		}

		return	<div className="col-xs-6">
						{posts}
					</div>
	}
});

// pipe back to App.jsx
module.exports = PostContainer;
