/**
 * RegisterPanel.jsx
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
var Button = rbs.Button;

var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;

var RegisterPanel = React.createClass({

  getInitialState() {
    return {
      usernameBsStyle: '',
      passwordBsStyle: '',
      validInput: false,
      errorText: 'Please enter a username',
      showError: false
    };
  },

  onChange() {
    // grab input values for processing
    var username = this.refs.username.getValue();
    var password = this.refs.password.getValue();

    // then lets see if confirm email matches the email field
    if(!_.isEmpty(username)) {
      this.setState({
        usernameBsStyle: 'success'
      });
    }
    // and finally, check if the password is set
    // TODO: password strength
    if(!_.isEmpty(password)) {
      // valid password
      this.setState({
        passwordBsStyle: 'success',
        validInput: true
      });
    } else {
      // invalid/nonexistent password
      this.setState({
        passwordBsStyle: 'error',
        errorText: 'Please enter a valid password',
        validInput: false
      });
    }
  },

  submit(e) {
    // prevent immediate form submission
    e.preventDefault();

    var username = this.refs.username.getValue();
    var password = this.refs.password.getValue();
    var email = this.refs.email.getValue();

    if(this.state.validInput) {
      // send api request
      $.post(
        constants.apiurl + '/users/',
        {
          username: username,
          password: password,
          email: (_.isEmpty(email)) ? undefined : email
        },
        function(data, textStatus, jqXHR) {
          //success
          // login the new user immediately
          $.post(
            constants.siteurl + '/login',
            {
              username: username,
              password: password
            },
            function(response) {
              // assume the login ajax worked
              // and redirect to the main app
              window.location.href = constants.siteurl;
            }
          );
        }
      ).fail(function(jqXHR) {
        // failure
        var response = jqXHR.responseJSON;
        // set error message to the one that
        // was returned from the server
        this.setState({
          errorText: response.message,
          showError: true
        });
      }.bind(this));

    } else {
      // TODO: more specific error messages
      this.setState({
        showError: true
      });
    }
  },

  render() {

    var error;
    if(this.state.showError) {
      error = (
        <div className='register-error'>
          <span>{ this.state.errorText }</span>
        </div>
      );
    }

    return (
      <Panel className="register-panel">
        <img className="profile-img" src={ constants.defaultProfileImage } alt="Avatar"/>
        { error }
        <form method='post' action='/register'>
          <Input
            type='text'
            name='username'
            placeholder='Username'
            ref='username'
            hasFeedback
            bsStyle={ this.state.usernameBsStyle }
            onChange={ this.onChange } />
          <Input
            type='password'
            name='password'
            ref='password'
            hasFeedback
            placeholder='Password'
            bsStyle={ this.state.passwordBsStyle }
            onChange={ this.onChange }/>
          <Input
            type='text'
            name='email'
            ref='email'
            hasFeedback
            placeholder='Email - Optional'
            onChange={ this.onChange }/>
          <RaisedButton
            className='register-submit'
            label='Register'
            ref='submit'
            onClick={ this.submit }/>
        </form>
      </Panel>
    );
  }
});
module.exports = RegisterPanel;
