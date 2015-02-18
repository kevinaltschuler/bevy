'use strict';

var React = require('react');
var RouterLink = require('./../../router/components/RouterLink.jsx');
var Router = require('./../../router/components/Router.jsx');

var Header = require('./Header.jsx');
var Navbar = require('./Navbar.jsx');
var PostSubmit = require('./../../post/components/PostSubmit.jsx');
var PostSort = require('./../../post/components/PostSort.jsx');
var LeftSidebar = require('./LeftSidebar.jsx');
var RightSidebar = require('./RightSidebar.jsx')
var PostContainer = require('./../../post/components/PostContainer.jsx');

var PostStore = require('./../../post/PostStore');



function getPostState() {
	return {
		allPosts: PostStore.getAll()
	}
}

module.exports = React.createClass({

	getInitialState: function() {
		PostStore.initialize();
		return getPostState();
	},

	componentDidMount: function() {
		PostStore.on('change', this._onPostChange);
	},

	componentWillUnmount: function() {
		PostStore.off('change', this._onPostChange);
	},

	_onPostChange: function() {
		this.setState(getPostState());
	},

	render: function(){
		return	<div>
						<Navbar />
						<div className="Container">
							<div className="row">
								<PostSubmit />
								<PostSort />
							</div>
							<LeftSidebar />

							<PostContainer
								allPosts = { this.state.allPosts }
							/>

							<RightSidebar />
						</div>
					</div>;
	}
});
