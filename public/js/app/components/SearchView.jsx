'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var constants = require('./../../constants');
var router = require('./../../router');

var user = window.bootstrap.user;

var PostContainer = require('./../../post/components/PostContainer.jsx');
var LeftSidebar = require('./LeftSidebar.jsx');

var SearchView = React.createClass({

	propTypes: {
		allPosts: React.PropTypes.array
	},

	getInitialState: function() {
		this.onRoute();
		return {
			posts: this.props.allPosts
		};
	},

	componentWillMount : function() {
		router.on('route', this.onRoute);
	},
	componentWillUnmount : function() {
		router.off('route', this.onRoute);
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

		return (
			<div className='main-section'>
				<LeftSidebar
					allBevies={ this.props.allBevies }
					activeBevy={ this.props.activeBevy }
					allThreads={ this.props.allThreads }
				/>
				<div className="search-body">
					<div className='message' style={{marginBottom: '20px'}}>
						Search for #{router.search_query}
					</div>
					<PostContainer
						allPosts={ this.state.posts }
					/>
				</div>
				<div className='right-sidebar' />
			</div>
		);
	}
});

module.exports = SearchView;
