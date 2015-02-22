'use strict';

var React = require('react');

var RegisterPanel = require('./RegisterPanel.jsx')

var rbs = require('react-bootstrap');
var Panel = rbs.Panel;
var Input = rbs.Input;
var Button = rbs.Button;

var RegisterPage = React.createClass({
	render: function() {
		return	<div className="login-container">
					<div className="login-header row">
						<img src="../../../img/logo_100.png" height="60" width="60"/>
					</div>
					<div className="login-title row">
						<h1>Create a New Account</h1>
					</div>
					<RegisterPanel />
				</div>
	}
});

module.exports = RegisterPage;