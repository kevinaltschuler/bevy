/**
 * LoginPanel.jsx
 *
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');
var {
  Panel,
  Input
} = require('react-bootstrap');
var {
  RaisedButton,
  FlatButton,
  TextField
} = require('material-ui');

var $ = require('jquery');
var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var UserActions = require('./../../user/UserActions');
var UserStore = require('./../../user/UserStore');
var USER = constants.USER;

var LoginPanel = React.createClass({
  getInitialState() {
    return {
      errorText: '',
      showError: false
    };
  },

  componentDidMount() {
    UserStore.on(USER.LOGGING_IN, this.onLoggingIn);
    UserStore.on(USER.LOGIN_SUCCESS, this.onLoginSuccess);
    UserStore.on(USER.LOGIN_ERROR, this.onLoginError);
  },
  componentWillUnmount() {
    UserStore.off(USER.LOGGING_IN, this.onLoggingIn);
    UserStore.off(USER.LOGIN_SUCCESS, this.onLoginSuccess);
    UserStore.off(USER.LOGIN_ERROR, this.onLoginError);
  },

  onLoggingIn() {

  },
  onLoginSuccess() {
    window.location.href = '/';
  },
  onLoginError(err) {
    this.setState({
      showError: true,
      errorText: err
    });
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

    UserActions.login(username, password);
  },

  onPasswordKeyUp(ev) {
    ev.preventDefault();
    if(ev.which == 13) {
      this.submit(ev);
    }
  },

  _renderError() {
    if(!this.state.showError) return <div />;
    return(
      <div className='login-error'>
        <span>{ this.state.errorText }</span>
      </div>
    );
  },

  render() {
    return (
      <Panel className="login-panel">
        <img
          className="profile-img"
          src="/img/user-profile-icon.png"
          alt="Avatar"
        />
        { this._renderError() }
        <form method='post' action='/login'>
          <TextField
            ref='username'
            type='text'
            hintText='Username/Email'
            style={{width: '100%'}}
          />
          <TextField
            ref='password'
            type='password'
            hintText='Password'
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
            fullWidth={true}
          />
        </form>
      </Panel>
    );
  }
});

module.exports = LoginPanel;
