/**
 * ForgotPage.jsx
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var {
  Input,
  Panel
} = require('react-bootstrap');
var {
  RaisedButton,
  TextField
} = require('material-ui');

var $ = require('jquery');
var _ = require('underscore');
var constants = require('./../../constants');

// helper function to validate whether an email is valid
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

var ForgotPage = React.createClass({
  getInitialState() {
    return {
      emailBsStyle: '',
      statusText: ''
    };
  },

  submit(ev) {
    ev.preventDefault();

    var email = this.refs.email.getValue();

    if(_.isEmpty(email)) {
      this.setState({
        statusText: 'Invalid Email'
      });
      return;
    }

    fetch(constants.siteurl + '/forgot', {
      method: 'POST',
      body: JSON.stringify({
        email: email
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        statusText: 'Email Sent!'
      });
    })
    .catch(err => {
      this.setState({
        statusText: err
      });
    });
  },

  onChange() {
    var $email = $(this.refs.email.getDOMNode());

    var emailVal = $email.find('input').val();

    if(!validateEmail(emailVal)) {
      this.setState({
        emailBsStyle: 'error'
      });
    } else {
      this.setState({
        emailBsStyle: 'success'
      });
    }
  },

  render() {
    var statusText;
    if(!_.isEmpty(this.state.statusText)) {
      statusText = (
        <div className='register-error'>
          <span>{ this.state.statusText }</span>
        </div>
      );
    }

    return (
      <div className='forgot-container'>
        <div className='forgot-header'>
          <h1>Forgot Password?</h1>
        </div>
        <Panel className="forgot-panel">
        <div className='forgot-header'>

        </div>
          { statusText }
          <form method='post' action='/forgot'>
            <TextField
              type='text'
              name='email'
              ref='email'
              placeholder='Email'
              style={{width: '100%', margin: '10px 0px'}}
              onChange={ this.onChange }/>
            <RaisedButton
              label='submit'
              style={{width: '100%'}}
              onClick={ this.submit } />
          </form>
        </Panel>
        <a
          href='/login'
          title='Login'
        >
          Back to Login
        </a>
      </div>
    );
  }
});

module.exports = ForgotPage;
