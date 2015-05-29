'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var constants = require('./../../constants');
var router = require('./../../router');

var user = window.bootstrap.user;

var PostContainer = require('./../../post/components/PostContainer.jsx');

var SearchView = React.createClass({

	getInitialState: function() {
		var query = router.search_query;
		this.onRoute();
		return {
			posts: [],
			query: query
		};
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

	componentWillMount: function() {
		router.on('route', this.onRoute);
	},

	componentWillUnmount: function() {
		router.off('route', this.onRoute);
	},

	render: function() {

		var postContainer = (_.isEmpty(this.state.posts))
		? ''
		: <PostContainer allPosts={ this.state.posts } />;

		return (
			<div className='main-section'>
				<h1>Search for <i>{ this.state.query }</i></h1>
				{ postContainer }
			</div>
		);
	}
});

module.exports = SearchView;
