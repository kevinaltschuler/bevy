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
var {
  Button
} = require('react-bootstrap');
var Ink = require('react-ink');
var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var resizeImage = require('./../../shared/helpers/resizeImage');

var UserActions = require('./../../user/UserActions');

var UserSidebar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    leftNavActions: React.PropTypes.object,
    sidebarActions: React.PropTypes.object
  },

  getInitialState() {
    return {
      image: window.bootstrap.user.image
    };
  },

  onUploadComplete(image) {
    this.setState({ image: image });
    UserActions.update(null, null, null, null, image);
  },

  closeSidebar() {
    this.props.leftNavActions.close();
  },

  viewDirectory() {
    this.props.sidebarActions.switchPage('directory');
  },

  editProfile() {
    this.props.leftNavActions.close();
    router.navigate('/profile/edit', { trigger: true });
  },

  viewProfile() {
    this.props.sidebarActions.switchPage('profile', window.bootstrap.user);
  },

  signOut() {
    this.props.leftNavActions.close();
    window.location.href = '/logout';
  },

  render() {
    var dropzoneOptions = {
      maxFiles: 1,
      acceptedFiles: 'image/*',
      clickable: '.dropzone-panel-button',
      dictDefaultMessage: ' '
    };

    return (
      <div className='user-sidebar'>
        <div className='profile'>
          <div className='green-rect' />
          <button
            className='close-button-container'
            title='Close Sidebar'
            onClick={ this.closeSidebar }
          >
            <div className='close-button'>
              <i className='material-icons'>close</i>
            </div>
          </button>
          <div className='picture-container'>
            <Uploader
              onUploadComplete={ this.onUploadComplete }
              className="profile-image-dropzone"
              style={{
                backgroundImage: 'url(' + resizeImage(this.state.image, 256, 256).url + ')'
              }}
              dropzoneOptions={ dropzoneOptions }
              tooltip='Change Profile Picture'
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
