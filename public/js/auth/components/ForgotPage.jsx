/**
 * ForgotPage.jsx
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
var Panel = rbs.Panel;

var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;

// helper function to validate whether an email is valid
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var ForgotPage = React.createClass({

	getInitialState: function() {
		return {
			  emailBsStyle: ''
			, statusText: ''
		};
	},

	submit: function(ev) {
		ev.preventDefault();

		var email = this.refs.email.getValue();

		if(_.isEmpty(email)) {
			this.setState({
				statusText: 'Invalid Email'
			});
			return;
		}

		$.post(
			constants.siteurl + '/forgot',
			{
				email: email
			},
			function(data) {
				//console.log(data);
				// success

				this.setState({
					statusText: 'Email Sent!'
				});
			}
		).fail(function(jqXHR) {
			// failure
			var response = jqXHR.responseJSON;

			this.setState({
				statusText: response.message
			});

		}.bind(this));
	},

	onChange: function() {
		var $email = $(this.refs.email.getDOMNode());

		var emailVal = $email.find('input').val();

		if(!validateEmail(emailVal)) {
			this.setState({
				emailBsStyle: 'error'
			});
		} else {
			this.setState({
				emailBsStyle: 'success'
			});
		}
	},

	render: function() {

		var statusText;
		if(!_.isEmpty(this.state.statusText)) {
			statusText =	<div>
									<span>{ this.state.statusText }</span>
								</div>
		}

		return	<div className='forgot-container'>		
					<div className='forgot-header'>
						<img src='/img/logo_100.png' height="60" width="60"/>
					</div>
					<Panel className="forgot-panel">
					<div className='forgot-header'>
						<h1>Forgot Password?</h1>
					</div>
						{ statusText }
						<form method='post' action='/forgot'>
							<Input
								type='text'
								name='email'
								ref='email'
								placeholder='Email'
								hasFeedback
								bsStyle={ this.state.emailBsStyle }
								onChange={ this.onChange }/>
							<RaisedButton
								label='Forgot Password'
								onClick={ this.submit } />
						</form>
					</Panel>
						<a href="/forgot">forgot your email?</a>
				</div>
	}
});
module.exports = ForgotPage;
