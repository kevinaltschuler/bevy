/**
 * RegisterPanel.jsx
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');
var {
  Panel,
  Input,
  Button
} = require('react-bootstrap');
var {
  RaisedButton,
  TextField
} = require('material-ui');

var $ = require('jquery');
var _ = require('underscore');
var constants = require('./../../constants');
var UserStore = require('./../../profile/UserStore');
var UserActions = require('./../../profile/UserActions');
var USER = constants.USER;

var usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

var RegisterPanel = React.createClass({
  getInitialState() {
    return {
      usernameColor: '#e0e0e0',
      validUsername: false
    };
  },

  componentDidMount() {
    UserStore.on(USER.LOGIN_ERROR, this.onError);
    UserStore.on(USER.REGISTER_ERROR, this.onError);
    UserStore.on(USER.REGISTER_SUCCESS, this.onRegisterSuccess);
    UserStore.on(USER.LOGIN_SUCCESS, this.onLoginSuccess);
  },
  componentWillUnmount() {
    UserStore.off(USER.LOGIN_ERROR, this.onError);
    UserStore.off(USER.REGISTER_ERROR, this.onError);
    UserStore.off(USER.REGISTER_SUCCESS, this.onRegisterSuccess);
    UserStore.off(USER.LOGIN_SUCCESS, this.onLoginSuccess);
  },

  onError(error) {

  },
  onRegisterSuccess() {

  },
  onLoginSuccess() {
    window.location.href = '/';
  },

  onUsernameChange(ev) {
    ev.preventDefault();

    if(this.usernameTimeout != undefined) {
      clearTimeout(this.usernameTimeout);
      delete this.usernameTimeout;
    }
    this.usernameTimeout = setTimeout(this.verifyUsername, 500);
  },

  onPasswordChange(ev) {
    ev.preventDefault();
  },

  onEmailChange(ev) {
    ev.preventDefault();
  },

  verifyUsername() {
    fetch(constants.apiurl + '/users/' + this.refs.Username.getValue() + '/verify', {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        validUsername: !res.found
      });
    })
    .catch(err => {
    });
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
    if(!this.state.validUsername) {
      this.refs.Username.setErrorText('Username already in use');
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

    UserActions.register(username, password, email);
  },

  _renderUsernameVerified() {
    var username = (this.refs.Username == undefined) ? '' : this.refs.Username.getValue();
    if(_.isEmpty(username)) return <div />;
    if(this.state.validUsername) {
      return <span className='glyphicon glyphicon-ok' />;
    } else {
      return <span className='glyphicon glyphicon-remove' />;
    }
  },

  render() {
    return (
      <Panel className="register-panel">
        <img className="profile-img" src={ constants.defaultProfileImage } alt="Avatar"/>
        <div className='register-fields'>
          <div className='username-field'>
            <TextField
              ref='Username'
              type='text'
              hintText='username (3-16 characters)'
              style={{width: '100%'}}
              onChange={ this.onUsernameChange }
              underlineFocusStyle={{ borderBottom: 'solid 1px' + this.state.usernameColor }}
            />
            { this._renderUsernameVerified() }
          </div>
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
        </div>
      </Panel>
    );
  }
});
module.exports = RegisterPanel;
