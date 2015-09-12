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
var FlatButton = mui.FlatButton;
var TextField = mui.TextField;

var router = require('./../../router');

var LoginPanel = React.createClass({

  getInitialState() {
    return {
      errorText: '',
      showError: false
    };
  },

  submit(e) {
    // prevent default form submission
    e.preventDefault();

    var username = this.refs.username.getValue();
    var password = this.refs.password.getValue();

    if(_.isEmpty(username)) {
      this.setState({
        errorText: 'Please enter your username',
        showError: true
      });
      return;
    }
    // dont need to check for valid email address - if they
    // used the register form it should be valid anyways
    if(_.isEmpty(password)) {
      this.setState({
        errorText: 'Please enter your password',
        showError: true
      });
      return;
    }

    $.post(
      constants.siteurl + '/login',
      {
        username: username,
        password: password
      },
      function(data) {
        // success
        // let's redirect to the app
        window.location.href = '/b/frontpage';
      }
    ).fail(function(jqXHR) {
      // a server-side error has occured (500 internal error)
      // load response from jqXHR
      var response = jqXHR.responseJSON;
      // show error
      this.setState({
        errorText: response.message,
        showError: true
      });
    }.bind(this));
  },

  onPasswordKeyUp(ev) {
    ev.preventDefault();
    if(ev.which == 13) {
      this.submit(ev);
    }
  },

  render() {
    var error;
    if(this.state.showError) {
      error = (
        <div className='login-error'>
          <span>{ this.state.errorText }</span>
        </div>
      );
    }

    return (
      <Panel className="login-panel">
        <img className="profile-img" src="/img/user-profile-icon.png" alt="Avatar"/>
        { error }
        <form method='post' action='/login'>
          <TextField 
            ref='username'
            type='text'
            hintText='username'
            style={{width: '100%'}}
          />
          <TextField 
            ref='password'
            type='password'
            hintText='password'
            style={{marginBottom: '10px', width: '100%'}}
            onKeyUp={ this.onPasswordKeyUp }
          />
          <RaisedButton
            className='login-submit'
            label='Sign In'
            style={{marginBottom: '10px'}}
            onClick={ this.submit }
            backgroundColor='#2cb673'
            labelColor='white'
            fullWidth={true}/>
        </form>
        <RaisedButton
          className='login-google-submit'
          label='Sign In With Google'
          linkButton={true}
          fullWidth={true}
          style={{marginBottom: '10px',textAlign: 'center'}}
          backgroundColor='#d34836'
          labelColor='white'
          href={ constants.siteurl + '/auth/google' } />
        <FlatButton
          className='register-button'
          label='Create an Account'
          linkButton={true}
          fullWidth={true}
          style={{width: '100%'}}
          href={ constants.siteurl + '/register'} />
      </Panel>
    );
  }
});

module.exports = LoginPanel;
