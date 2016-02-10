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
var UserStore = require('./../../user/UserStore');
var UserActions = require('./../../user/UserActions');
var USER = constants.USER;

var usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

var RegisterInputs = React.createClass({
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

    this.setState({
      username: this.refs.Username.getValue(),
      verifying: true
    })

    if(this.usernameTimeout != undefined) {
      clearTimeout(this.usernameTimeout);
      delete this.usernameTimeout;
    }
    this.usernameTimeout = setTimeout(this.verifyUsername, 500);
  },

  onPasswordChange(ev) {
    this.setState({
      password: this.refs.Password.getValue()
    })
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
        validUsername: !res.found,
        verifying: false
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
    if(this.state.verifying) {
      // loading indicator
      return (
        <section className="loaders small">
          <span className="loader small loader-quart"> </span>
        </section>
      );
    }
    if(this.state.validUsername) {
      return <span className='glyphicon glyphicon-ok' />;
    } else {
      return <span className='glyphicon glyphicon-remove' />;
    }
  },

  render() {
    return (
      <div className="register-panel" style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <img 
          className="profile-img" 
          src={ constants.defaultProfileImage } 
          alt="Avatar"
          style={{borderRadius: 50,width: 100, height: 100, marginBottom: 20}}
        />
        <div className='register-fields'>
          <div className='username-field' style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
            <div 
              className='verify-status'
              style={{width: (this.state.username) ? 50 : 0, transition: '.2s all ease-in-out'}}
            >
              { this._renderUsernameVerified() }
            </div>
            <TextField
              ref='Username'
              type='text'
              hintText='username (3-16 characters)'
              style={{width: '100%'}}
              onChange={ this.onUsernameChange }
              underlineFocusStyle={{ borderBottom: 'solid 1px' + this.state.usernameColor }}
            />
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
            onClick={ this.props._onNext }
            label="Next"
            style={{ marginLeft: '10px' }}
            disabled={ !this.state.validUsername || !this.state.password }
          />
        </div>
      </div>
    );
  }
});
module.exports = RegisterInputs;
