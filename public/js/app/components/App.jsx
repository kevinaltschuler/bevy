'use strict';

var React = require('react');
var RouterLink = require('./../../router/components/RouterLink.jsx');
var Router = require('./../../router/components/Router.jsx');

var Header = require('./Header.jsx');
var Navbar = require('./Navbar.jsx')

module.exports = React.createClass({
	render: function(){
		return <div>
		<Navbar />
		<Router />
		the app<br/>
		<RouterLink href="#/test">test</RouterLink>
		</div>;

	}
});
