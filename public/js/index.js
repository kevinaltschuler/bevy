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

require('./shared/polyfills/Object.assign.js');

var Backbone = require('backbone');
var $ = require('jquery');
global.jQuery = require('jquery');
Backbone.$ = $;

require('bootstrap');

var React = require('react');

var Navbar = require('./app/components/Navbar.jsx');
var MainSection = require('./app/components/MainSection.jsx');

var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var injectTapEventPlugin = require('react-tap-event-plugin');
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

Backbone.sync = function(method, model) {
	alert(method + ':' + JSON.stringify(model));
	// set a flub id
	model.set('id', Date.now());
}

//React.render(<App />, document.getElementById('app'));

var App = React.createClass({
	render: function() {
		return	<div>
						<Navbar />
						<RouteHandler/>
					</div>
	}
});

var routes = (
	<Route name='app' path='/' handler={App}>
		<DefaultRoute handler={MainSection} />
	</Route>
);

Router.run(routes, function(Handler) {
	React.render(<Handler/>, document.getElementById('app'));
});
