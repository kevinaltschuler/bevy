'use strict';

var React = require('react');
var $ = require('jquery');
var _ = require('underscore');

var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var Panel = rbs.Panel;
var Input = rbs.Input;
var Button = rbs.Button;

var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;

// helper function to validate whether an email is valid
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var RegisterPanel = React.createClass({

	getInitialState: function() {
		return {
			  emailBsStyle: ''
			, confirmEmailBsStyle: ''
			, passwordBsStyle: ''
			, validInput: false
			, errorText: ''
			, showError: false
		};
	},

	onChange: function() {
		// set jquery objects
		var $email = $(this.refs.email.getDOMNode());
		var $confirmEmail = $(this.refs.confirmEmail.getDOMNode());
		var $password = $(this.refs.password.getDOMNode());

		// grab input values for processing
		var emailVal = $email.find('input').val();
		var confirmEmailVal = $confirmEmail.find('input').val();
		var passwordVal = $password.find('input').val();

		// first check if the email is valid
		// TODO: validate this on the server as well
		if(!validateEmail(emailVal)) {
			//console.log('not valid email');
			this.setState({
				  emailBsStyle: 'error'
				, errorText: 'Please enter a valid email address'
				, confirmEmailBsStyle: ''
				, validInput: false
			});
		} else {
			this.setState({
				  emailBsStyle: 'success'
			});

			// then lets see if confirm email matches the email field
			if(emailVal == confirmEmailVal
				&& !_.isEmpty(emailVal) && !_.isEmpty(confirmEmailVal)) {

				this.setState({
					confirmEmailBsStyle: 'success'
				});

				// and finally, check if the password is set
				// TODO: password strength
				if(!_.isEmpty(passwordVal)) {
					this.setState({
						  passwordBsStyle: 'success'
						, validInput: true
					});
				} else {
					this.setState({
						  passwordBsStyle: 'error'
						, errorText: 'Please enter a valid password'
						, validInput: false
					})
				}

			} else {
				this.setState({
					  confirmEmailBsStyle: 'error'
					, errorText: 'Please ensure that the given emails match'
					, validInput: false
				});
			}
		}
	},

	submit: function(e) {
		// prevent immediate form submission
		e.preventDefault();

		var email = this.refs.email.getValue();
		var password = this.refs.password.getValue()

		if(this.state.validInput) {
			//console.log('everything checks out!');

			// send api request
			$.post(
				constants.apiurl + '/users/',
				{
					  email: email
					, password: password
					//, test: 'true'
				},
				function(data, textStatus, jqXHR) {
					//success
					//console.log(data);
					// login the new user immediately
					$.post(
						constants.siteurl + '/login',
						{
							  email: email
							, password: password
						},
						function(response) {
							window.location.href = constants.siteurl;
						}
					);
				},
				'json'
			).fail(function(jqXHR) {
				// failure
				var response = jqXHR.responseJSON;
				// set error message to the one that
				// was returned from the server
				this.setState({
					  errorText: response.message
					, showError: true
				});
			}.bind(this));

		} else {
			// TODO: more specific error messages
			this.setState({
				showError: true
			});
		}
	},

	render: function() {

		var error;
		if(this.state.showError) {
			error = <div className='register-error'>
							<span>{ this.state.errorText }</span>
						</div>;
		}

		return	<Panel className="register-panel">
						<img className="profile-img" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt=""/>
						{ error }
						<form method='post' action='/register'>
							<Input
								type="text"
								name='email'
								placeholder="Email"
								ref='email'
								hasFeedback
								bsStyle={ this.state.emailBsStyle }
								onChange={ this.onChange } />
		  					<Input
		  						type="text"
		  						placeholder="Confirm Email"
		  						ref='confirmEmail'
		  						hasFeedback
		  						bsStyle={ this.state.confirmEmailBsStyle }
		  						onChange={ this.onChange } />
		  					<Input
		  						type="password"
		  						name='password'
		  						ref='password'
		  						hasFeedback
		  						placeholder="New Password"
		  						bsStyle={ this.state.passwordBsStyle }
		  						onChange={ this.onChange }/>
							<RaisedButton
								className='register-submit'
								label="Register"
								ref='submit'
								onClick={ this.submit }/>
						</form>
					</Panel>;
	}
});
module.exports = RegisterPanel;
