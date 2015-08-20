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
var passwordRegex = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

var RegisterPanel = React.createClass({

  getInitialState() {
    return {
      usernameColor: '#e0e0e0',
      passwordColor: '',
      emailColor: '',
      validInput: false,
      errorText: 'Please enter a username',
      showError: false
    };
  },

  onChange(ev) {
    ev.preventDefault();
    // grab input values for processing
    var username = this.refs.username.getValue();
    var password = this.refs.password.getValue();
    var email = this.refs.email.getValue();


    if(!usernameRegex.test(username) || username.length == 0) {
      this.refs.username.setErrorText('invalid username');
      this.setState({
        validInput: false
      });
    }

    if(!passwordRegex.test(password) || password.length == 0) {
      this.refs.password.setErrorText('invalid password');
      this.setState({
        validInput: false
      });
    }
    if(!emailRegex.test(email) && email.length > 0) {
      this.refs.email.setErrorText('invalid email');
      this.setState({
        validInput: false
      });
    } else {
      this.refs.email.setErrorText('');
    }

    if((emailRegex.test(email) || email.length == 0) 
      && passwordRegex.test(password) && password.length >= 6 
      && usernameRegex.test(username) && username.length >= 3) {
      this.setState({
        validInput: true
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

  causeError(ev) {
    ev.preventDefault();
    this.refs.username.setErrorText('invalid username');
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

    var usernameStyle={
      borderBottom: 'solid 1px' + this.state.usernameColor
    };

    return (
      <Panel className="register-panel">
        <img className="profile-img" src={ constants.defaultProfileImage } alt="Avatar"/>
        { error }
        <form method='post' action='/register'>
          <TextField 
            ref='username'
            type='text'
            hintText='username (3-16 characters)'
            style={{width: '100%'}}
            onChange={this.onChange}
            underlineFocusStyle={usernameStyle}
          />
          <TextField 
            ref='password'
            type='password'
            hintText='password (6-20 characters)'
            style={{width: '100%'}}
            onChange={this.onChange}
          />
          <TextField 
            ref='email'
            type='text'
            hintText='email (optional)'
            style={{marginBottom: '10px', width: '100%'}}
            onChange={this.onChange}
          />
          <RaisedButton
            className='register-submit'
            label='Register'
            ref='submit'
            disabled={!this.state.validInput}
            onClick={ this.submit }
            style={{width: '100%'}}/>
        </form>
      </Panel>
    );
  }
});
module.exports = RegisterPanel;
