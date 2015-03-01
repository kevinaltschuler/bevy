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
		, activeBevy: ReactPropTypes.number.isRequired
	},

	getInitialState: function() {
		return {};
	},

	render: function() {

		if(Object.keys(this.props.allPosts).length < 1) {
			// no posts
			// still return column so the app retains its structure
			return	<div className="col-xs-6 post-container">
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
			posts.push(<Post id={ post.id } key={ post.id }/>);
		}

		return	<div className="col-xs-6 post-container">
						{posts}
					</div>
	}
});

// pipe back to App.jsx
module.exports = PostContainer;
