'use strict';

require('./shared/polyfills/Object.assign.js');

var Backbone = require('backbone');
var $ = require('jquery');
global.jQuery = require('jquery');
Backbone.$ = $;

require('bootstrap');

var React = require('react');
var App = require('./app/components/App.jsx');

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

React.render(<App />, document.getElementById('app'));

