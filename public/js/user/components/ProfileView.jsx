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

var ProfileView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    editing: React.PropTypes.bool
  },

  getInitialState() {
    let user = {};
    let loading = true;
    // get the username that we're viewing from the router
    let username = router.profile_username;
    // if we're viewing ourselves, no need to fetch
    if(username == window.bootstrap.user.username) {
      user = window.bootstrap.user;
      loading = false;
    } else {
      // if the bevy is loaded, then fetch the user immediately.
      // otherwise we need to wait until it has
      if(this.props.activeBevy._id != undefined) this.loadUser(this.props.activeBevy._id);
    }
    // spoof a name object if it's empty to avoid a reference error
    if(user.name == undefined || _.isEmpty(user.name))
      user.name = { firstName: '', lastName: '' };

    return {
      editing: this.props.editing,
      user: user,
      loading: loading,
      firstName: user.name.firstName,
      lastName: user.name.lastName,
      title: user.title || '',
      phoneNumber: user.phoneNumber || '',
      image: user.image
    };
  },

  componentWillReceiveProps(nextProps) {
    // once the bevy is loaded from the bevy store, then we can fetch the user
    if(this.state.loading && nextProps.activeBevy._id != undefined) {
      this.loadUser(nextProps.activeBevy._id);
    }
    // update the editing flag if the url changed
    this.setState({ editing: nextProps.editing });
  },

  onUploadComplete(image) {
    this.setState({ image: image });
  },

  loadUser(bevy_id) {
    let username = router.profile_username;
    // else, fetch the user we're viewing from the server
    fetch(constants.apiurl + '/users/' + username + '?bevy_id=' + bevy_id, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      if(!_.isObject(res)) {
        console.error(res.toString());
        return;
      }
      this.setState({
        user: res,
        loading: false
      });
    });
  },

  startEditing() {
    router.navigate('/profile/' + this.state.user.username + '/edit');
    this.setState({ editing: true });
  },

  stopEditing() {
    router.navigate('/profile/' + this.state.user.username);

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

    // stop editing
    this.stopEditing();
  },

  renderLoading() {
    if(!this.state.loading) return <div />;
    return (
      <div className='loading-container'>
        <h1 className='loading-title'>Loading User</h1>
        <CircularProgress
          mode='indeterminate'
          size={ 1.5 }
          color='#2CB673'
        />
      </div>
    );
  },

  renderHeader() {
    if(this.state.loading) return <div />;
    if(this.state.editing) {
      return (
        <div className='edit-header'>
          <h1>Edit Your Profile</h1>
          <h4>Profile information is visible to all group members</h4>
        </div>
      );
    } else return <div />;
  },

  renderActions() {
    let editButton = (window.bootstrap.user._id == this.state.user._id)
      ? (
        <RaisedButton
          label='Edit Profile'
          onClick={ this.startEditing }
          title='Edit your profile'
        />
      ) : <div />;
    return (
      <div className='actions'>
        { editButton }
        <RaisedButton
          label='View Posts'
          title='View posts from this user'
        />
      </div>
    );
  },

  renderPanel() {
    if(this.state.loading) return <div />
    if(this.state.editing) {
      return this.renderEditPanel();
    } else {
      return this.renderViewPanel();
    }
  },

  renderEditPanel() {
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

  renderViewPanel() {
    return (
      <Panel className='view-panel'>
        <div
          className='profile-picture'
          style={{
            backgroundImage: 'url(' + resizeImage(this.state.user.image, 1000, 600).url + ')'
          }}
        />
        <span className='name'>
          { (_.isEmpty(this.state.user.name))
              ? this.state.user.username
              : this.state.user.fullName }
        </span>
        <span className='description'>
          { this.state.user.title }
        </span>
        { this.renderActions() }
        <div className='details'>
          <div className='detail-item'>
            <span className='detail-key'>
              Username
            </span>
            <span className='detail-value'>
              { this.state.user.username }
            </span>
          </div>
          <div className='detail-item'>
            <span className='detail-key'>
              Email
            </span>
            <a
              className='email-link'
              href={ 'mailto:' + this.state.user.email }
              title={ 'Email ' + this.state.user.username }
            >
              { this.state.user.email }
            </a>
          </div>
          <div className='detail-item'>
            <span className='detail-key'>
              Joined
            </span>
            <span className='detail-value'>
              { timeAgo(Date.parse(this.state.user.created)) }
            </span>
          </div>
        </div>
      </Panel>
    );
  },

  render() {
    return (
      <div className='profile-view'>
        { this.renderLoading() }
        { this.renderHeader() }
        { this.renderPanel() }
      </div>
    );
  }
});

module.exports = ProfileView;
