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
var MainSection = require('./app/components/MainSection.jsx');

var LoginPage = require('./auth/components/LoginPage.jsx');
var RegisterPage = require('./auth/components/RegisterPage.jsx');
var ForgotPage = require('./auth/components/ForgotPage.jsx');
var ResetPage = require('./auth/components/ResetPage.jsx');
var FourOhFour = require('./app/components/FourOhFour.jsx');

//Needed for onTouchTap - a feature of Material-UI
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
//var injectTapEventPlugin = require('react-tap-event-plugin');
//injectTapEventPlugin();

//console.log(window.bootstrap);

// App bootstrap
var App = React.createClass({
	render: function() {
		return (
			<div>
				<InterfaceComponent />
			</div>
		);
	}
});

var router = require('./router');

var InterfaceComponent = React.createClass({
	componentWillMount : function() {
		this.callback = (function() {
			this.forceUpdate();
		}).bind(this);

		router.on('route', this.callback);
	},
	componentWillUnmount : function() {
		router.off('route', this.callback);
	},
	render : function() {
		switch(router.current) {
			case 'home':
				return <MainSection />
				break;
			case 'login':
				return <LoginPage />
				break;
			case 'register':
				return <RegisterPage />
				break;
			case 'forgot':
				return <ForgotPage />
				break;
			case 'reset':
				return <ResetPage />
				break;
			case '404':
				return <FourOhFour />
				break;
			default:
				return <MainSection />
				break;
		}
	}
});

React.render(<App />, document.body);
