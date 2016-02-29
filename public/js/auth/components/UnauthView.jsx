/**
 * UnauthView.jsx
 *
 * View to let user know that they're in the wrong bevy
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');

var UnauthView = React.createClass({
  propTypes: {

  },

  render() {
    return (
      <div className='unauth-view'>
        <div className='jenk-navbar'>
          <a href='/' title='Home' className='home-button'>
            <img src='/img/logo_300_white.png' className='home-button-img' />
          </a>
          <span className='title'>
            Bevy
          </span>
        </div>
        <h1 className='title'>😥Unauthorized😥</h1>
        <h4>You ({ window.bootstrap.user.email }) are not a part of this bevy. Did you mean to go to</h4>
        <a
          className='link'
          href={ 'http://' + window.bootstrap.user.bevy.slug + '.' + constants.domain }
          title={ window.bootstrap.user.bevy.name }
        >
          { window.bootstrap.user.bevy.slug + '.' + constants.domain }
        </a>
      </div>
    );
  }
});

module.exports = UnauthView;
