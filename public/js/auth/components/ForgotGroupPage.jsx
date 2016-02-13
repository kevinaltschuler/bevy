/**
 * ForgotTeamPage.jsx
 *
 * page to let user know what group they're in
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  Panel
} = require('react-bootstrap');
var {
  TextField,
  RaisedButton,
  CircularProgress
} = require('material-ui');
var Ink = require('react-ink');

var _ = require('underscore');
var constants = require('./../../constants');

var ForgotGroupPage = React.createClass({
  getInitialState() {
    return {
      verifying: false,
      verified: false,
      emailError: ''
    };
  },

  submit() {
    if(this.state.verifying) return;

    var email = this.refs.email.getValue();
    if(_.isEmpty(email)) {
      this.setState({ emailError: 'Please enter your email address' });
      return;
    }

    this.setState({ verifying: true });
    fetch(constants.siteurl + '/forgot/group', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    })
    .then(res => res.json())
    .then(res => {
      if(!_.isObject(res)) {
        this.setState({
          verifying: false,
          emailError: res.toString()
        });
        return;
      }

      this.setState({
        verifying: false,
        verified: true,
        emailError: ''
      });
    })
    .catch(err => {
      this.setState({
        verifying: false,
        emailError: err.toString()
      });
    });
  },

  onEmailChange() {
    var email = this.refs.email.getValue();
    if(_.isEmpty(email)) {
      this.setState({ emailError: '' });
    }
  },

  renderLoadingOrArrow() {
    if(this.state.verifying) {
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

  renderInputPanel() {
    if(this.state.verified) return <div />;

    var fakeEmails = _.pluck(constants.fakeUsers, 'email');
    return (
      <Panel className='forgot-group-panel'>
        <span className='prompt'>
          Please enter your <span className='bold'>email address</span>
        </span>
        <div className='inputs'>
          <TextField
            type='text'
            ref='email'
            name='email'
            placeholder={ fakeEmails[Math.floor(Math.random() * fakeEmails.length)] }
            errorText={ this.state.emailError }
            onChange={ this.onEmailChange }
            style={{ width: '100%' }}
          />
        </div>
        <span className='explain'>
          An email will be sent to this address containing a link to the group you belong to
        </span>
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
            Send me a sign in email
          </span>
          { this.renderLoadingOrArrow() }
        </button>
      </Panel>
    );
  },

  renderSuccessPanel() {
    if(!this.state.verified) return <div />;
    return (
      <Panel className='forgot-group-panel'>
        <span className='prompt'>
          We found an account and a Bevy group associated with your email address.
          You will find an email in your inbox from us shortly.
        </span>
        <br />
        <span className='prompt'>
          Still not sure what email you used to create your Bevy account?
          <br />
          Please contact us at&nbsp;
          <a title='Contact Us' href='mailto:contact@joinbevy.com'>contact@joinbevy.com</a>
        </span>
      </Panel>
    );
  },

  render() {
    return (
      <div className='forgot-group-page'>
        <div className='title-header'>
          <a title='Home' href={ constants.siteurl }>
            <img src='/img/logo_200_solid.png' height="60" width="60"/>
          </a>
          <h1>Bevy</h1>
        </div>
        <div className='forgot-group-header'>
          <h2>{ (this.state.verified) ? 'Reminder Sent!' : 'Find your group' }</h2>
        </div>
        { this.renderInputPanel() }
        { this.renderSuccessPanel() }
        <div className='back-link'>
          <a title='Sign In' href='/signin'>Back to Login</a>
        </div>
      </div>
    );
  }
});

module.exports = ForgotGroupPage;
