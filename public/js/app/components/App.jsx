'use strict';

var React = require('react');
var RouterLink = require('./../../router/components/RouterLink.jsx');
var Router = require('./../../router/components/Router.jsx');

var Header = require('./Header.jsx');
var Navbar = require('./Navbar.jsx');
var PostSubmit = require('./PostSubmit.jsx');
var PostSort = require('./PostSort.jsx');

module.exports = React.createClass({
	render: function(){
		return <div>
		<Navbar />
		<div className="Container">
			<div className="row">
				<PostSubmit />
				<PostSort />
			</div>
		</div>
		</div>;

	}
});
