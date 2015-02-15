'use strict';

require('./shared/polyfills/Object.assign.js');

var Backbone = require('backbone');
Backbone.$ = require('jquery');

var React = require('react');
var App = require('./app/components/App.jsx');

//var RouterStore = require('./router/RouterStore');

React.render(<App />, document.getElementById('app'));
