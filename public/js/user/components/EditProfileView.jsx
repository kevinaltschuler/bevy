/**
 * ProfileView.jsx
 *
 * page to view and edit a user's profile
 * within a bevy
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var {
  Panel,
  Input
} = require('react-bootstrap');
var {
  TextField,
  CircularProgress,
  RaisedButton
} = require('material-ui');
var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var resizeImage = require('./../../shared/helpers/resizeImage');
var timeAgo = require('./../../shared/helpers/timeAgo');

var UserActions = require('./../../user/UserActions');

var EditProfileView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    let user = window.bootstrap.user;
    // spoof a name object if it's empty to avoid a reference error
    if(user.name == undefined || _.isEmpty(user.name))
      user.name = { firstName: '', lastName: '' };

    return {
      editing: this.props.editing,
      user: user,
      firstName: user.name.firstName,
      lastName: user.name.lastName,
      title: user.title || '',
      phoneNumber: user.phoneNumber || '',
      image: user.image
    };
  },

  componentWillReceiveProps(nextProps) {
  },

  onUploadComplete(image) {
    this.setState({ image: image });
  },

  stopEditing() {
    router.navigate('/', { trigger: true });

    // make a spoof copy if name doesn't exist
    // to avoid a reference error
    let name = (_.isEmpty(this.state.user.name))
      ? { firstName: '', lastName: '' }
      : this.state.user.name;

    this.setState({
      editing: false,
      // erase all changes
      firstName: name.firstName,
      lastName: name.lastName,
      image: this.state.user.image,
      title: this.state.user.title,
      phoneNumber: this.state.user.phoneNumber
    });
  },
  saveEditing() {
    // collect all changes from the state
    let firstName = this.state.firstName;
    let lastName = this.state.lastName;
    let title = this.state.title;
    let phoneNumber = this.state.phoneNumber;
    let image = this.state.image;
    // load the user so we can modify it
    let user = this.state.user;

    // perform optimistic update
    user.firstName = firstName;
    user.lastName = lastName;
    user.fullName = firstName + ' ' + lastName;
    user.title = title;
    user.phoneNumber = phoneNumber;
    user.image = image;

    // send this to the store so it can
    // sync with the server
    UserActions.update(firstName, lastName, title, phoneNumber, image);
    // apply optimistic update
    this.setState({ user: user });
    window.bootstrap.user = user;

    // stop editing
    this.stopEditing();
  },

  renderPanel() {
    var dropzoneOptions = {
      maxFiles: 1,
      acceptedFiles: 'image/*',
      clickable: '.dropzone-panel-button',
      dictDefaultMessage: ' ',
    };

    var profileImage = (_.isEmpty(this.state.image))
      ? constants.defaultProfileImage
      : resizeImage(this.state.image, 256, 256).url;
    var profileImageStyle = {
      backgroundImage: 'url(' + profileImage + ')'
    };

    return (
      <Panel className='edit-panel'>
        <div className='left'>
          <span className='input-title'>First Name</span>
          <Input
            ref='firstname'
            type='text'
            value={ this.state.firstName }
            onChange={() => this.setState({ firstName: this.refs.firstname.getValue() })}
          />
          <span className='input-title'>Last Name</span>
          <Input
            ref='lastname'
            type='text'
            value={ this.state.lastName }
            onChange={() => this.setState({ lastName: this.refs.lastname.getValue() })}
          />
          <span className='input-title'>Title</span>
          <Input
            ref='title'
            type='text'
            value={ this.state.title }
            onChange={() => this.setState({ title: this.refs.title.getValue() })}
          />
          <span className='hint'>
            Who are you in { this.props.activeBevy.name }?
            <br />
            e.g., "President and Event Coordinator"
          </span>
          <span className='input-title'>Phone Number</span>
          <Input
            ref='phonenumber'
            type='text'
            value={ this.state.phoneNumber }
            onChange={() => this.setState({ phoneNumber: this.refs.phonenumber.getValue() })}
          />
          <div className='edit-buttons'>
            <RaisedButton
              label='Cancel'
              onClick={ this.stopEditing }
              title='Cancel'
            />
            <RaisedButton
              label='Save Changes'
              labelColor='#FFF'
              backgroundColor='#2CB673'
              onClick={ this.saveEditing }
              title='Save Changes'
            />
          </div>
        </div>
        <div className='right'>
          <span className='prompt'>Profile Photo</span>
          <div className="profile-picture overlay">
            <Uploader
              onUploadComplete={ this.onUploadComplete }
              className="profile-image-dropzone"
              style={ profileImageStyle }
              dropzoneOptions={ dropzoneOptions }
              tooltip=''
            />
          </div>
        </div>
      </Panel>
    );
  },

  render() {
    return (
      <div className='edit-profile-view'>
        <div className='edit-header'>
          <h1>Edit Your Profile</h1>
          <h4>Profile information is visible to all group members</h4>
        </div>
        { this.renderPanel() }
        <a
          className='back-link'
          title={ 'Go back to ' + this.props.activeBevy.name }
          href={ 'http://' + this.props.activeBevy.slug + '.' + constants.domain }
        >
          Back to { this.props.activeBevy.name }
        </a>
      </div>
    );
  }
});

module.exports = EditProfileView;
