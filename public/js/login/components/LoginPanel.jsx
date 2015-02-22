'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var Panel = rbs.Panel;
var Input = rbs.Input;
var Button = rbs.Button;

var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;

var LoginPanel = React.createClass({
	render: function() {
		return	<Panel className="login-panel">
						<img class="profile-img" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt=""/>
						<Input type="text" placeholder="Email" />
	  					<Input type="text" placeholder="Password" />
						<div className="panel-bottom">
							<RaisedButton label="Sign in" linkButton={true} href="#"/>
						</div>
					</Panel>;
				}
			});

module.exports = LoginPanel;