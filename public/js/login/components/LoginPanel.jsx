/**
 * LoginPanel.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

// imports
var React = require('react');
var $ = require('jquery');
var _ = require('underscore');
var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var Panel = rbs.Panel;
var Input = rbs.Input;

var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;

var LoginPanel = React.createClass({

	getInitialState: function() {
		return {
			  errorText: ''
			, showError: false
		};
	},

	submit: function(e) {
		// prevent default form submission
		e.preventDefault();

		if(_.isEmpty(this.refs.email.getValue())) {
			this.setState({
				  errorText: 'Please enter your email address'
				, showError: true
			});
			return;
		}
		// dont need to check for valid email address - if they
		// used the register form it should be valid anyways
		if(_.isEmpty(this.refs.password.getValue())) {
			this.setState({
				  errorText: 'Please enter your password'
				, showError: true
			});
			return;
		}

		$.post(
			constants.siteurl + '/login',
			{
				  email: this.refs.email.getValue()
				, password: this.refs.password.getValue()
			},
			function(data) {
				// success
				// let's redirect to the app
				window.location.href = constants.siteurl;
			}
		).fail(function(jqXHR) {
			// a server-side error has occured
			// load response from jqXHR
			var response = jqXHR.responseJSON;
			// show error
			this.setState({
				  errorText: response.message
				, showError: true
			});
		}.bind(this));
	},

	render: function() {

		var error;
		if(this.state.showError) {
			error = <div className='login-error'>
							<span>{ this.state.errorText }</span>
						</div>;
		}

		return	<Panel className="login-panel">
						<img className="profile-img" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="Avatar"/>
						{ error }
						<form method='post' action='/login'>
							<Input
								type='text'
								name='email'
								ref='email'
								placeholder='Email' />
		  					<Input
		  						type='password'
		  						name='password'
		  						ref='password'
		  						placeholder='Password' />
							<RaisedButton
								className='login-submit'
								label='Sign In'
								onClick={ this.submit }/>
						</form>
					</Panel>;
	}
});
module.exports = LoginPanel;
