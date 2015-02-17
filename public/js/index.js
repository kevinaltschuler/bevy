'use strict';

require('./shared/polyfills/Object.assign.js');

var Backbone = require('backbone');
var $ = require('jquery');
global.jQuery = require('jquery');
Backbone.$ = $;

require('bootstrap');

var React = require('react');
var App = require('./app/components/App.jsx');

//var RouterStore = require('./router/RouterStore');

React.render(<App />, document.getElementById('app'));

