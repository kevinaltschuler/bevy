'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var Panel = rbs.Panel;
var Input = rbs.Input;
var Button = rbs.Button;

var RegisterPanel = React.createClass({
	render: function() {
		return	<Panel className="login-panel">
						<img class="profile-img" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt=""/>
						<Input type="text" placeholder="Email" />
	  					<Input type="text" placeholder="Confirm Email" />
	  					<Input type="text" placeholder="New Password" />
						<div className="panel-bottom">
							<Button>
							Register
							</Button>
						</div>
					</Panel>;
				}
			});

module.exports = RegisterPanel;