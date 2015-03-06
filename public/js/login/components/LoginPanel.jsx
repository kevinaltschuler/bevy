/**
 * LoginPanel.jsx
 *
 * @author albert
 * @author kevin
 */

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
						<form method='post' action='/login'>
							<img className="profile-img" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt=""/>
							<Input type="text" name='email' placeholder="Email" />
		  					<Input type="password" name='password' placeholder="Password" />
							<RaisedButton className='login-submit' label='Sign In'>
								<input value='' type='submit'/>
							</RaisedButton>
						</form>
					</Panel>;
				}
			});

module.exports = LoginPanel;
