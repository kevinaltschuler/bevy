/**
 * InvitePage.jsx
 *
 * Page that users go to when they receive an email invite
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  TextField,
  RaisedButton,
  FlatButton,
  CircularProgress
} = require('material-ui');
var {
  Panel
} = require('react-bootstrap');
var Ink = require('react-ink');

var _ = require('underscore');
var constants = require('./../../constants');
var async = require('async');

var UserActions = require('./../../user/UserActions');
var UserStore = require('./../../user/UserStore');

var USER = constants.USER;

var InvitePage = React.createClass({
  getInitialState() {
    return {
      invite: window.bootstrap.inviteToken,
      username: '',
      usernameError: '',
      password: '',
      passwordError: '',
      loading: false
    };
  },

  componentDidMount() {
    UserStore.on(USER.LOGIN_SUCCESS, this.onLoginSuccess);
    UserStore.on(USER.LOGIN_ERROR, this.onLoginError);
  },

  componentWillUnmount() {
    UserStore.off(USER.LOGIN_SUCCESS, this.onLoginSuccess);
    UserStore.off(USER.LOGIN_ERROR, this.onLoginError);
  },

  onLoginSuccess() {
    // redirect to the bevy they just joined
    window.location.href = `http://${this.state.invite.bevy.slug}.${constants.domain}`;
  },
  onLoginError(error) {
    this.setState({
      loading: false,
      usernameError: error
    });
  },

  onUsernameKeyUp(ev) {
    if(ev.which == 13) {
      this.refs.username.blur();
      this.refs.password.focus();
    }
  },
  onUsernameChange() {
    // update the username state value
    var username = this.refs.username.getValue();
    this.setState({ username: username });
    // clear the username error if they erased the username
    if(_.isEmpty(username)) {
      this.setState({ usernameError: '' });
    }
  },
  onPasswordKeyUp(ev) {
    if(ev.which == 13) {
      this.refs.password.blur();
      this.submit();
    }
  },
  onPasswordChange() {
    // update the password state value
    var password = this.refs.password.getValue();
    this.setState({ password: password });
    // clear the password error if they erased the password
    if(_.isEmpty(password)) {
      this.setState({ passwordError: '' });
    }
  },

  submit() {
    // break out immediately if already loading
    if(this.state.loading) return;

    // load state vars
    var username = this.state.username;
    var password = this.state.password;

    // map of allowed username characters
    var allowed_chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-', '1', '2', '3',
      '4', '5', '6', '7', '8', '9', '0'];

    // break out if username is empty
    if(_.isEmpty(username)) {
      this.setState({ usernameError: 'Please enter a username' });
      this.refs.username.focus();
      return;
    }
    // loop thru username characters and break out if a character isn't in the allowed chars map
    var i = 0;
    var char = '';
    while(i < username.length) {
      if(!_.contains(allowed_chars, username.charAt(i))) {
        this.setState({ usernameError: 'Only lowercase letters, numbers, and hyphens are allowed' });
        this.refs.username.focus();
        return;
      }
      i++;
    }
    // check username length
    if(username.length > 16) {
      this.setState({ usernameError: 'Username must be less than 16 characters' });
      this.refs.username.focus();
      return;
    } else if (username.length < 3) {
      this.setState({ usernameError: 'Username must be more than 3 characters' });
      this.refs.username.focus();
      return;
    }
    // if everything's ok, then clear the error
    this.setState({ usernameError: '' });

    // break out if password is empty
    if(_.isEmpty(password)) {
      this.setState({ passwordError: 'Please enter a password' });
      this.refs.password.focus();
      return;
    }
    // and clear the error if everythings ok
    this.setState({ passwordError: '' });

    // flip loading flag
    this.setState({ loading: true });

    var invite = this.state.invite;

    async.waterfall([
      // first check if the username isn't taken yet
      function(done) {
        fetch(constants.apiurl + '/verify/username', {
          method: 'POST',
          body: JSON.stringify({
            username: username,
            bevy_id: invite.bevy._id
          })
        })
        .then(res => res.json())
        .then(res => {
          if(!_.isObject(res)) return done(res);
          if(res.found) return done('Username already taken');
          // username not found, move on to accept the invite
          return done(null);
        })
        .catch(err => done(err.toString()));
      },
      // accept the invite
      function(done) {
        fetch(`${constants.apiurl}/invites/${invite.token}/accept`, {
          method: 'POST',
          body: JSON.stringify({
            username: username,
            password: password
          })
        })
        .then(res => res.json())
        .then(res => {
          if(!_.isObject(res)) return done(res);
          return done(null);
        })
        .catch(err => done(err.toString()));
      },
      // log in the user
      function(done) {
        UserActions.login(invite.email, password);
        return done(null);
      }
    ], function(err, result) {
      if(err) {
        this.setState({
          usernameError: err,
          loading: false
        });
      }
      return;
    }.bind(this));
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
        <i className='material-icons'>arrow_forward</i>
      );
    }
  },

  renderBody() {
    return (
      <div className='invite-body'>
        <h1 className='title'>
          Join <span className='bold'>{ this.state.invite.bevy.name }</span>
        </h1>
        <span className='email'>
          Joining as <span className='bold'>{ this.state.invite.email }</span>
        </span>
        <div className='inputs'>
          <span className='input-label'>Username</span>
          <TextField
            ref='username'
            type='text'
            name='username'
            placeholder={ 'e.g., ' + this.state.invite.email.split('@')[0]}
            errorText={ this.state.usernameError }
            value={ this.state.username }
            onChange={ this.onUsernameChange }
            onKeyUp={ this.onUsernameKeyUp }
            underlineFocusStyle={{
              borderColor: '#666'
            }}
          />
          <span className='input-hint'>
            Usernames can only contain lowercase letters, numbers, and hyphens.
            They must be between 3 and 16 characters.
          </span>
          <span className='input-label'>Password</span>
          <TextField
            ref='password'
            type='password'
            name='password'
            placeholder='•••••••••'
            errorText={ this.state.passwordError }
            value={ this.state.password }
            onChange={ this.onPasswordChange }
            onKeyUp={ this.onPasswordKeyUp }
            underlineFocusStyle={{
              borderColor: '#666'
            }}
          />
          {/*<span className='input-hint'>
          </span>*/}
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
              Continue
            </span>
            { this.renderLoadingOrArrow() }
          </button>
        </div>
      </div>
    );
  },

  render() {
    return (
      <div className='invite-page'>
        <div className='header'>
          <a title='Home' href='/'>
            <img
              className='bevy-logo'
              src={ constants.siteurl + '/img/logo_200_solid.png' }
            />
          </a>
          <a title='Home' href='/' className='bevy-title-btn'>
            Bevy
          </a>
        </div>
        { this.renderBody() }
        <a className='back-link' href={ constants.siteurl + '/signin' }>
          Back to login
        </a>
        <br/>
        <span>
          by creating an account or a bevy you agree to our &nbsp;
          <a className='back-link' href={ constants.siteurl + '/privacy' }>
            Privacy Policy 
          </a>
          &nbsp; and &nbsp;
          <a className='back-link' href={ constants.siteurl + '/tos' }>
            Terms of Service
          </a>
        </span>
        <br/>

      </div>
    );
  }
});

module.exports = InvitePage;
