/**
 * ForgotPage.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');
var $ = require('jquery');
var _ = require('underscore');
var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var Input = rbs.Input;
var Panel = rbs.Panel;

var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;

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

    $.post(
      constants.siteurl + '/forgot',
      {
        email: email
      },
      function(data) {
        console.log(data);
        // success

        this.setState({
          statusText: 'Email Sent!'
        });
      }.bind(this)
    ).fail(function(jqXHR) {
      // failure
      var response = jqXHR.responseJSON;

      this.setState({
        statusText: response.message
      });

    }.bind(this));
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
        <a href='/login'>Back to Login</a>
      </div>
    );
  }
});

module.exports = ForgotPage;
