'use strict';

console.log('app loaded');

require('./shared/polyfills/Object.assign.js');

var React = require('react');
var App = require('./app/components/App.jsx');

React.render(<App />, document.getElementById('app'));
