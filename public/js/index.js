/**
 * index.js
 *
 * true entry point of the app
 * loaded by index.html
 *
 * set up all dependents and bootstrap React
 *
 * @author albert
 */

'use strict';

// polyfills and shims
// files/functions which patch functionality for
// older browsers that don't support new features
// TODO: es6 support
require('./shared/polyfills/Object.assign.js');

// load globals
var Backbone = require('backbone');
global.jQuery = require('jquery');
Backbone.$ = require('jquery');

require('bootstrap');

var React = require('react');

// load components
var Navbar = require('./app/components/Navbar.jsx');
var MainSection = require('./app/components/MainSection.jsx');
var ProfilePage = require('./profile/components/ProfilePage.jsx');
var LoginPage = require('./login/components/LoginPage.jsx');

// load react-router
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;


//Needed for onTouchTap - a feature of Material-UI
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();


// override default save function
// remove when DB connection is stable
Backbone.sync = function(method, model) {
	alert(method + ':' + JSON.stringify(model));
	// set a flub id
	model.set('id', Date.now());
}


// App bootstrap
var App = React.createClass({
	render: function() {
		return	<div>
					<Navbar />
					<RouteHandler/>
				</div>
	}
});

// route configuration
var routes = (
	<Route name='app' path='/' handler={App}>
		<Route name='profile' handler={ProfilePage} />
		<Route name='login' handler={LoginPage} />
		<DefaultRoute handler={MainSection} />
	</Route>
);

Router.run(routes, function(Handler) {
	React.render(<Handler/>, document.getElementById('app'));
});
