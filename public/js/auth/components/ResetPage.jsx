/**
 * ResetPage.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');
var $ = require('jquery');
var _ = require('underscore');
var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var Input = rbs.Input;
var Panel=rbs.Panel;

var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;

var ResetPage = React.createClass({

	getInitialState: function() {
		return {
			statusText: '',
			passBsStyle: '',
			confirmPassBsStyle: ''
		};
	},

	onChange: function() {

		var pass = this.refs.pass.getValue();
		var confirmPass = this.refs.pass.getValue();

		if(!_.isEmpty(pass) && pass == confirmPass) {
			this.setState({
				passBsStyle: 'success',
				confirmPassBsStyle: 'success'
			});
		} else if(!_.isEmpty(pass) && pass != confirmPass) {
			this.setState({
				confirmPassBsStyle: 'success'
			});
		}
	},

	submit: function(ev) {
		ev.preventDefault();

		var pass = this.refs.pass.getValue();
		var confirmPass = this.refs.confirmPass.getValue();

		if(_.isEmpty(pass)) {
			this.setState({
				statusText: 'Please enter a password',
				passBsStyle: 'error'
			});
			return;
		}

		if(pass != confirmPass) {
			this.setState({
				statusText: 'Passwords do not match',
				confirmPassBsStyle: 'error'
			});
			return;
		}

		$.post(
			constants.siteurl + '/reset/' + this.getParams().token,
			{
				password: pass
			},
			function(data) {
				// success
				window.location.href = constants.siteurl + '/login';
			}
		).fail(function(jqXHR) {
			// failure
			var response = jqXHR.responseJSON;

		}.bind(this));
	},

	render: function() {

		var status;
		if(!_.isEmpty(this.state.statusText)) {
			status = <div>
							<span>{ this.state.statusText }</span>
						</div>
		}


		return <div className='forgot-container'>
					<div className='forgot-header'>
						<a href='/'>
							<img src='/img/logo_100.png' height="60" width="60"/>
						</a>
					</div>
					<Panel className="forgot-panel">
						<h1>Reset Password</h1>
						{ status }
						<form method='post' action='/reset'>
							<Input
								type='password'
								name='pass'
								ref='pass'
								hasFeedback
								bsStyle={ this.state.passBsStyle }
								placeholder='New Password'
								onChange={ this.onChange } />
							<Input
								type='password'
								name='confirmPass'
								ref='confirmPass'
								hasFeedback
								bsStyle={ this.state.confirmPassBsStyle }
								placeholder='Confirm Password'
								onChange={ this.onChange } />
							<RaisedButton
								label='Submit'
								onClick={ this.submit } />
						</form>
					</Panel>
					<a href='/login'>Back to Login</a>
				 </div>
	}
});
module.exports = ResetPage;
