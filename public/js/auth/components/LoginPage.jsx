/**
 * LoginPage.jsx
 *
 * the login page
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var LoginPanel = require('./LoginPanel.jsx');

var _ = require('underscore');
var constants = require('./../../constants');

var LoginPage = React.createClass({
  getInitialState() {
    var router = require('./../../router');
    return {
      bevySlug: (router.bevy_slug == undefined) ? '' : router.bevy_slug
    };
  },

  render() {
    return (
      <div className='login-container'>
        <div className='login-header'>
          <a title='Home' href={ constants.siteurl }>
            <img src='/img/logo_200_solid.png' height="60" width="60"/>
          </a>
          <h1>Bevy</h1>
        </div>
        <div className='login-title'>
          <h2>Sign in to continue.</h2>
        </div>
        <LoginPanel
          bevySlug={ this.state.bevySlug }
        />
        <div className='back-link'>
          <a
            title='Forgot your password?'
            href={ constants.siteurl + '/forgot' }
          >
            Forgot your password?
          </a>
        </div>
        <div className='back-link'>
          <a
            title='Sign into a different group'
            href={ constants.siteurl + '/login'}
          >
            Sign into a different group
          </a>
        </div>
        <br/>
      </div>
    );
  }
});

module.exports = LoginPage;
