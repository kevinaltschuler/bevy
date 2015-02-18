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
		}

		var allPosts = this.props.allPosts;
		var posts = [];

		for(var key in allPosts) {
			posts.push(<Post />);
		}

		return	<div className="col-xs-6">
						{posts}
					</div>
	}
});

module.exports = PostContainer;
