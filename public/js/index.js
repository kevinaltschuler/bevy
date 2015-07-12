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
var $ = require('jquery');

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
var router = require('./router');

// chrome and maybe other browsers like to remember the scroll position on a page reload
// when theres a specified post in the url we need to override this by delaying this action a bit
// very jenk. will change later.
document.onreadystatechange = function() {
	if(document.readyState == 'complete') {
		setTimeout(function() {
			if(router.post_id) {
				var post = document.getElementById('post:' + router.post_id);
				if(post) {
					post.scrollIntoView();
					if($(document).scrollTop() != ($(document).height() - $(window).height()))
						$(document).scrollTop($(document).scrollTop() - 68);
				}
			}
		}, 50);
	}
};


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
			default:
				return <MainSection />
				break;
		}
	}
});

React.render(<App />, document.body);
