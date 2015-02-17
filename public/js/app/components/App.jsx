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

module.exports = React.createClass({
	render: function(){
		return	<div>
						<Navbar />
						<div className="Container">
							<div className="row">
								<PostSubmit />
								<PostSort />
							</div>
							<LeftSidebar />

							<PostContainer />

							<RightSidebar />
						</div>
					</div>;

	}
});
