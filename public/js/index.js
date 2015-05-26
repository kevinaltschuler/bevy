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

var _ = require('underscore');

// load globals
var Backbone = require('backbone');

// patch toJSON function to support nested stuff
/*Backbone.Model.prototype.toJSON = function() {
    if (this._isSerializing) {
        return this.id || this.cid;
    }
    this._isSerializing = true;
    var json = _.clone(this.attributes);
    _.each(json, function(value, name) {
        _.isFunction((value || "").toJSON) && (json[name] = value.toJSON());
    });
    this._isSerializing = false;
    return json;
}*/

var React = require('react');

// load components
var Navbar = require('./app/components/Navbar.jsx');
var MainSection = require('./app/components/MainSection.jsx');

var LoginPage = require('./auth/components/LoginPage.jsx');
var RegisterPage = require('./auth/components/RegisterPage.jsx');
var ForgotPage = require('./auth/components/ForgotPage.jsx');
var ResetPage = require('./auth/components/ResetPage.jsx');

// load react-router
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Redirect = Router.Redirect;

//Needed for onTouchTap - a feature of Material-UI
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
//var injectTapEventPlugin = require('react-tap-event-plugin');
//injectTapEventPlugin();


// App bootstrap
var App = React.createClass({
	render: function() {
		return (
			<div>
				<RouteHandler/>
			</div>
		);
	}
});

// route configuration
var routes = (
	<Route name='app' path='/' handler={ App }>
		<Route name='login' handler={ LoginPage } />
		<Route name='register' handler={ RegisterPage } />
		<Route name='forgot' handler={ ForgotPage } />
		<Route name='reset' path='reset/:token' handler={ ResetPage } />
		{/*<DefaultRoute handler={ MainSection } />*/}
		<Route name='home' path='/b/' handler={ MainSection } />
		<Redirect to='home' />
	</Route>
);

Router.run(routes, Router.HistoryLocation, function(Handler) {
	React.render(<Handler/>, document.getElementById('app'));
});
