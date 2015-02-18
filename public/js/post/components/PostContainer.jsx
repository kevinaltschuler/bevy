'use strict';

var React = require('react');
var ReactPropTypes = React.PropTypes;

var Post = require('./Post.jsx');
var PostStore = require('./../PostStore');


var PostContainer = React.createClass({

	propTypes: {
		allPosts: ReactPropTypes.array.isRequired
	},

	getInitialState: function() {
		return {};
	},

	render: function() {

		if(Object.keys(this.props.allPosts).length < 1) {
			// no posts
			return <div className="col-xs-6" />;
		}

		var allPosts = this.props.allPosts;
		var posts = [];

		for(var key in allPosts) {
			var post = allPosts[key];
			posts.push(<Post title = { post.title }
				body = { post.body } image_url = { post.image_url }
				author = { post.author } bevy = { post.bevy } />);
		}

		return	<div className="col-xs-6">
						{posts}
					</div>
	}
});

module.exports = PostContainer;
