/**
 * UserSidebar.jsx
 *
 * a page in the sidebar that lets you use and edit your profile
 * and also log out
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  RaisedButton,
  CircularProgress
} = require('material-ui');
var Ink = require('react-ink');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var resizeImage = require('./../../shared/helpers/resizeImage');

var UserSidebar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    leftNavActions: React.PropTypes.object
  },

  viewDirectory() {

  },

  editProfile() {
    this.props.leftNavActions.close();
    router.navigate('/profile/edit', { trigger: true });
  },

  signOut() {
    this.props.leftNavActions.close();
    window.location.href = '/logout';
  },

  render() {
    return (
      <div className='user-sidebar'>
        <div className='profile'>
          <div className='green-rect' />
          <div className='picture-container'>
            <div
              className='picture'
              style={{
                backgroundImage: 'url(' + resizeImage(window.bootstrap.user.image, 128, 128).url + ')'
              }}
            />
          </div>
          <div className='details'>
            <span className='big-name'>
              { (_.isEmpty(window.bootstrap.user.fullName))
                  ? window.bootstrap.user.username
                  : window.bootstrap.user.fullName }
            </span>
            <span className='small-name'>
              { (_.isEmpty(window.bootstrap.user.fullName))
                  ? ''
                  : window.bootstrap.user.username }
            </span>
            <span className='email'>
              { window.bootstrap.user.email }
            </span>
          </div>
        </div>
        <span className='button-header'>
          Bevy
        </span>
        <button
          className='action-button'
          title={'View the members of ' + this.props.activeBevy.name }
          onClick={ this.viewDirectory }
        >
          <Ink />
          <i className='material-icons'>perm_contact_calendar</i>
          <span className='action-button-text'>
            Group Directory
          </span>
        </button>
        <span className='button-header'>
          Account Settings
        </span>
        <button
          className='action-button'
          title='View your profile'
          onClick={ this.viewProfile }
        >
          <Ink />
          <i className='material-icons'>person</i>
          <span className='action-button-text'>
            View Profile
          </span>
        </button>
        <div className='button-separator' />
        <button
          className='action-button'
          title='Edit your profile'
          onClick={ this.editProfile }
        >
          <Ink />
          <i className='material-icons'>edit</i>
          <span className='action-button-text'>
            Edit Profile
          </span>
        </button>
        <div className='button-separator' />
        <button
          className='action-button'
          onClick={ this.signOut }
          title='Sign out of Bevy'
        >
          <Ink />
          <i className='material-icons'>exit_to_app</i>
          <span className='action-button-text'>
            Sign out
          </span>
        </button>

      </div>
    )
  }
});

module.exports = UserSidebar;
