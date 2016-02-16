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

var InvitePage = React.createClass({
  getInitialState() {
    return {
      loadingInitial: true,
      bevy: {},
      invite: {},
      username: '',
      usernameError: '',
      password: '',
      passwordError: '',
      loading: false
    };
  },

  componentDidMount() {
    var router = require('./../../router');
    var inviteToken = router.inviteToken;
    fetch(constants.apiurl + '/invites/' + inviteToken, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      setTimeout(() => {
        this.setState({
          loadingInitial: false,
          bevy: res.bevy,
          invite: res
        });
      }, 750);
    })
    .catch(err => {
      console.error(err.toString());
    });
  },

  onUsernameChange() {
    var username = this.refs.username.getValue();
    this.setState({ username: username });
    if(_.isEmpty(username)) {
      this.setState({ usernameError: '' });
    }
  },
  onPasswordChange() {
    var password = this.refs.password.getValue();
    this.setState({ password: password });
    if(_.isEmpty(password)) {
      this.setState({ passwordError: '' });
    }
  },

  submit() {
    var username = this.state.username;
    var password = this.state.password;

    var allowed_chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-', '1', '2', '3',
      '4', '5', '6', '7', '8', '9', '0'];

    if(_.isEmpty(username)) {
      this.setState({ usernameError: 'Please enter a username' });
      return;
    }
    var i = 0;
    var char = '';
    while(i < username.length) {
      if(!_.contains(allowed_chars, username.charAt(i))) {
        this.setState({ usernameError: 'Only lowercase letters, numbers, and hyphens are allowed' });
        return;
      }
      i++;
    }
    if(username.length > 16) {
      this.setState({ usernameError: 'Username must be less than 16 characters' });
      return;
    } else if (username.length < 3) {
      this.setState({ usernameError: 'Username must be more than 3 characters' });
      return;
    }
    this.setState({ usernameError: '' });

    if(_.isEmpty(password)) {
      this.setState({ passwordError: 'Please enter a password' });
      return;
    }
    this.setState({ passwordError: '' });

    this.setState({ loading: true });
    // first check if the username isn't taken yet
    fetch(constants.apiurl + '/verify/username', {
      method: 'POST',
      body: JSON.stringify({
        username: this.state.username,
        bevy_id: this.state.bevy._id
      })
    })
    .then(res => res.json())
    .then(res => {
      if(!_.isObject(res)) {
        return;
      }
      if(res.found) {
        this.setState({
          usernameError: 'Username already taken',
          loading: false
        });
        return;
      }

    })
    .catch(err => {

    });
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
    if(this.state.loadingInitial) {
      return (
        <div className='loading-container'>
          <h1 className='loading-title'>
            Loading invite...
          </h1>
          <CircularProgress
            mode='indeterminate'
            color='#2CB673'
            size={ 1.5 }
          />
        </div>
      );
    }
    return (
      <div className='invite-body'>
        <div className='sidebar'>
          <h1 className='title'>
            Join <span className='bold'>{ this.state.bevy.name }</span>
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
              placeholder={ 'e.g., ' + 'asdflkasfd'}
              errorText={ this.state.usernameError }
              value={ this.state.username }
              onChange={ this.onUsernameChange }
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
        <div className='big-image'>
          <img
            className='promo-image'
            src={ constants.siteurl + '/img/simplemock.png' }
          />
        </div>
      </div>
    );
  },

  render() {
    return (
      <div className='invite-page'>
        <div className='fake-navbar'>
          <a title='Home' href='/'>
            <img
              className='bevy-logo'
              src={ constants.siteurl + '/img/logo_100_reversed.png' }
            />
          </a>
          <a title='Home' href='/' className='bevy-title-btn'>
            Bevy
          </a>
        </div>
        { this.renderBody() }
      </div>
    );
  }
});

module.exports = InvitePage;
