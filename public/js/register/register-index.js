/**
 * register-index.js
 *
 * entry point for the register page
 *
 * @author albert
 */

'use strict';

// polyfills and shims
// files/functions which patch functionality for
// older browsers that don't support new features
// TODO: es6 support
require('./../shared/polyfills/Object.assign.js');

// load globals
var Backbone = require('backbone');
global.jQuery = require('jquery');
Backbone.$ = require('jquery');

require('bootstrap');

var React = require('react');

//Needed for onTouchTap - a feature of Material-UI
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

// load react-router
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// App bootstrap
var App = React.createClass({
	render: function() {
		return	<div>
						<RouteHandler/>
					</div>
	}
});

var RegisterPage = require('./components/RegisterPage.jsx');

// route configuration
var routes = (
	<Route name='app' path='/' handler={App}>
		<DefaultRoute handler={RegisterPage} />
	</Route>
);

Router.run(routes, function(Handler) {
	React.render(<Handler/>, document.getElementById('app'));
});
