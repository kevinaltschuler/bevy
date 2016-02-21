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
  TextField,
  CircularProgress
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
      emailError: '',
      passwordError: '',
      loading: false
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
    this.setState({ loading: true });
  },
  onLoginSuccess() {
    window.location.href = '/';
  },

  onLoginError(err) {
    this.setState({
      loading: false,
      passwordError: err.toString()
    });
    // focus the password field for ease
    this.refs.password.focus();
  },

  submit(e) {
    // prevent default form submission
    e.preventDefault();
    // if the request is already pending, then get out of here
    if(this.state.loading) return;

    // load username and password from the TextFields
    var email = this.refs.email.getValue();
    var password = this.refs.password.getValue();

    // break out if the username is empty
    if(_.isEmpty(email)) {
      this.setState({ emailError: 'Please enter your email address' });
      return;
    }
    // check the validity of the email by just checking if there are characters
    // before and after an @ symbol. super simple no regex
    if(email.split('@').length != 2) {
      this.setState({ emailError: 'Please enter a valid email address' });
      return;
    }
    // clear the username error if we got here
    this.setState({ emailError: '' });
    // break out if password is empty
    if(_.isEmpty(password)) {
      this.setState({ passwordError: 'Please enter your password' });
      return;
    }
    // clear the password error if we got here
    this.setState({ passwordError: '' });

    UserActions.login(email, password);
  },

  onPasswordKeyUp(ev) {
    ev.preventDefault();
    // if the user presses enter, while editing the password TextField,
    // then start the login process
    if(ev.which == 13) {
      this.submit(ev);
    }
  },

  renderLoadingOrArrow() {
    if(this.state.loading) {
      return (
        <div className='progress-container'>
          <CircularProgress
            mode='indeterminate'
            color='#FFF'
            size={ 0.4 }
          />
        </div>
      );
    } else {
      return (
        <div />
      );
    }
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
        <div className='inputs'>
          <span className='input-label'>Email Address</span>
          <TextField
            ref='email'
            type='text'
            hintText={ 'e.g., ' + fakeEmails[Math.floor(Math.random() * fakeEmails.length)] }
            errorText={ this.state.emailError }
            underlineFocusStyle={{borderColor: '#666'}}
            style={{ width: '100%', marginBotton: '10px' }}
          />
          <span className='input-label'>Password</span>
          <TextField
            ref='password'
            type='password'
            hintText='e.g., •••••••••'
            style={{ marginBottom: '10px', width: '100%' }}
            underlineFocusStyle={{borderColor: '#666'}}
            errorText={ this.state.passwordError }
            onKeyUp={ this.onPasswordKeyUp }
          />
          <button
            className='submit-btn'
            onClick={ this.submit }
            style={{
              cursor: (this.state.loading)
                ? 'default'
                : 'pointer',
              backgroundColor: (this.state.loading)
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
