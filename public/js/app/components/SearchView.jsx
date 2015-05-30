'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var constants = require('./../../constants');
var router = require('./../../router');

var user = window.bootstrap.user;

var PostContainer = require('./../../post/components/PostContainer.jsx');

var SearchView = React.createClass({

	propTypes: {
		allPosts: React.PropTypes.array
	},

	getInitialState: function() {
		return {};
	},

	onRoute: function() {
		var query = router.search_query;

		$.ajax({
			url: constants.apiurl + '/users/' + user._id + '/posts/search/' + query,
			method: 'GET',
			success: function(data) {
				this.setState({
					posts: data,
					query: query
				});
			}.bind(this)
		});
	},


	render: function() {

		var postContainer = <PostContainer allPosts={ this.props.allPosts } />;

		return (
			<div className='main-section'>
				<h1>Search for <i>{ router.search_query }</i></h1>
				{ postContainer }
			</div>
		);
	}
});

module.exports = SearchView;
