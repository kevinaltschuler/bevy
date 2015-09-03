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
var TextField = mui.TextField;
var usernameRegex = /^[a-z0-9_-]{3,16}$/;
var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

var RegisterPanel = React.createClass({

  getInitialState() {
    return {
      usernameColor: '#e0e0e0',
      passwordColor: '',
      emailColor: ''
    };
  },

  onUsernameChange(ev) {
    ev.preventDefault();
  },

  onPasswordChange(ev) {
    ev.preventDefault();
  },

  onEmailChange(ev) {
    ev.preventDefault();
  },

  validateUsername() {
    var username = this.refs.Username.getValue();
    if(_.isEmpty(username)) {
      this.refs.Username.setErrorText('Please enter a username');
      return false;
    }
    if(username.length < 3) {
      this.refs.Username.setErrorText('Username too short - needs to be longer than 3 characters');
      return false;
    }
    if(username.length > 16) {
      this.refs.Username.setErrorText('Username too long - needs to be shorter than 16 characters');
      return false;
    }
    if(!usernameRegex.test(username)) {
      this.refs.Username.setErrorText('Only characters a-z, numbers, underscores, and dashes are allowed');
      return false;
    }
    this.refs.Username.setErrorText('');
    return true;
  },

  validatePassword() {
    var password = this.refs.Password.getValue();
    if(_.isEmpty(password)) {
      this.refs.Password.setErrorText('Please enter a password');
      return false;
    }
    this.refs.Password.setErrorText('');
    return true;
  },

  validateEmail() {
    var email = this.refs.Email.getValue();
    if(_.isEmpty(email)) {
      return true; // allow no email
    }
    if(!emailRegex.test(email)) {
      this.refs.Email.setErrorText('Invalid email');
      return false;
    }
    this.refs.Email.setErrorText('');
    return true;
  },

  submit(ev) {
    
  },

  register(ev) {
    ev.preventDefault();

    if(!this.validateUsername() || !this.validatePassword() || !this.validateEmail()) {
      return; // failed validation
    }

    var username = this.refs.Username.getValue();
    var password = this.refs.Password.getValue();
    var email = this.refs.Email.getValue();

    // send api request
    $.ajax({
      url: constants.apiurl + '/users/',
      method: 'POST',
      data: {
        username: username,
        password: password,
        email: (_.isEmpty(email)) ? undefined : email
      },
      success: function(data) {
        //success
        // login the new user immediately
        $.ajax({
          url: constants.siteurl + '/login',
          method: 'POST',
          data: {
            username: username,
            password: password
          },
          success: function(response) {
            // assume the login ajax worked
            // and redirect to the main app
            window.location.href = constants.siteurl;
          }.bind(this),
          error: function(error) {
            console.log(error.responseJSON);
          }
        });
      }.bind(this),
      error: function(error) {
        console.log(error.responseJSON);
      }
    });
  },

  render() {

    return (
      <Panel className="register-panel">
        <img className="profile-img" src={ constants.defaultProfileImage } alt="Avatar"/>
        <form method='post' action='/register'>
          <TextField 
            ref='Username'
            type='text'
            hintText='username (3-16 characters)'
            style={{width: '100%'}}
            onChange={ this.onUsernameChange }
            underlineFocusStyle={{ borderBottom: 'solid 1px' + this.state.usernameColor }}
          />
          <TextField 
            ref='Password'
            type='password'
            hintText='password'
            style={{width: '100%'}}
            onChange={ this.onPasswordChange }
          />
          <TextField 
            ref='Email'
            type='text'
            hintText='email (optional)'
            style={{marginBottom: '10px', width: '100%'}}
            onChange={ this.onEmailChange }
          />
          <RaisedButton
            className='register-submit'
            label='Register'
            ref='submit'
            onClick={ this.register }
            style={{width: '100%'}}/>
        </form>
      </Panel>
    );
  }
});
module.exports = RegisterPanel;
