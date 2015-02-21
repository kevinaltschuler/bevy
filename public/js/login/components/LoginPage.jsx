'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var Panel = rbs.Panel;
var Input = rbs.Input;
var Button = rbs.Button;

var mui = require('material-ui');
var IconButton = mui.IconButton;

var LoginPage = React.createClass({
	render: function() {
		return	<div className="login-container">
					<div className="login-header row">
						<img src="../../../img/logo_100.png" height="60" width="60"/>
					</div>
					<div className="login-title row">
						<h1>Join the Fun ;)</h1>
						<h2>Sign in to continue to Bevy.</h2> 
					</div>
					<Panel className="login-panel">
						<img class="profile-img" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt=""/>
						<Input type="text" placeholder="Username" />
	  					<Input type="text" placeholder="Password" />
						<div className="panel-bottom">
							<Button>
							Sign in
							</Button>
						</div>
					</Panel>
					<a href="#">
						Create an account
					</a>
				</div>
	}
});

module.exports = LoginPage;