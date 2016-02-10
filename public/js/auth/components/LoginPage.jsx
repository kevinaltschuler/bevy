/**
 * LoginPage.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

// imports
var React = require('react');
var LoginPanel = require('./LoginPanel.jsx');

var constants = require('./../../constants');

var LoginPage = React.createClass({
  render() {
    return (
      <div className='login-container'>
        <div className='login-header'>
          <a title='Home' href={ constants.siteurl }>
            <img src='/img/logo_200.png' height="60" width="60"/>
          </a>
          <h1>Bevy</h1>
        </div>
        <div className='login-title'>
          <h2>Sign in to continue.</h2>
        </div>
        <LoginPanel />
        <div className='back-link'>
          <a title='Forgot your password?' href="/forgot">Forgot your password?</a>
        </div>
        <br/>
      </div>
    );
  }
});

module.exports = LoginPage;
