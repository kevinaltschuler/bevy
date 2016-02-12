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
var Ink = require('react-ink');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var UserActions = require('./../../user/UserActions');
var UserStore = require('./../../user/UserStore');
var USER = constants.USER;



var LoginPanel = React.createClass({
  propTypes: {
    bevySlug: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      errorText: '',
      showError: false,
      verifying: false
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

  renderLoadingOrArrow() {
    return <div />;
  },

  render() {
    var fakeEmails = _.pluck(constants.fakeUsers, 'email');
    return (
      <Panel className="login-panel">
        <h2 className='bevy-title'>
          Sign in to <span className='bold'>{ this.props.bevySlug }.{ constants.domain }</span>
        </h2>
        <span className='prompt'>
          Please enter your <span className='bold'>email address</span> and <span className='bold'>password</span>.
        </span>
        { this._renderError() }
        <div className='inputs'>
          <span className='input-label'>Email Address</span>
          <TextField
            ref='username'
            type='text'
            hintText={ 'e.g., ' + fakeEmails[Math.floor(Math.random() * fakeEmails.length)] }
            style={{width: '100%'}}
          />
          <span className='input-label'>Password</span>
          <TextField
            ref='password'
            type='password'
            hintText='e.g., •••••••••'
            style={{marginBottom: '10px', width: '100%'}}
            onKeyUp={ this.onPasswordKeyUp }
          />
          <button
            className='submit-btn'
            onClick={ this.submit }
            style={{
              cursor: (this.state.verifying)
                ? 'default'
                : 'pointer',
              backgroundColor: (this.state.verifying)
                ? '#888'
                : '#2CB673'
            }}
          >
            <Ink />
            <span className='submit-button-text'>
              Sign In
            </span>
            { this.renderLoadingOrArrow() }
          </button>
        </div>
      </Panel>
    );
  }
});

module.exports = LoginPanel;
