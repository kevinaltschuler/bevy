/**
 * ProfileDropdown.jsx
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var {
  Button,
  Overlay,
  OverlayTrigger,
  Tooltip
} = require('react-bootstrap');
var {
  FlatButton,
  TextField
} = require('material-ui');
var AddAccountModal = require('./AddAccountModal.jsx');
var LinkedAccountItem = require('./LinkedAccountItem.jsx');
var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var UserActions = require('./../UserActions');
var UserStore = require('./../UserStore');
var constants = require('./../../constants');
var USER = constants.USER;
var user = window.bootstrap.user;

var ProfileDropdown = React.createClass({
  propTypes: {
    show: React.PropTypes.bool,
    onToggle: React.PropTypes.func
  },

  getInitialState() {
    return {
      image: user.image
    };
  },

  componentDidMount() {
    this.container = ReactDOM.findDOMNode(this.refs.Container);
    UserStore.on(USER.CHANGE_ALL, this.handleChangeAll);
  },
  componentWillUnmount() {
    UserStore.off(USER.CHANGE_ALL, this.handleChangeAll);
  },

  handleChangeAll() {
  },

  onUploadComplete(file) {
    this.setState({
      image: file
    });
    UserActions.update(file);
  },

  toggle(ev) {
    ev.preventDefault();
    this.props.onToggle();
  },

  renderOverlay() {
    var dropzoneOptions = {
      maxFiles: 1,
      acceptedFiles: 'image/*',
      clickable: '.dropzone-panel-button',
      dictDefaultMessage: ' ',
    };

    var profileImage = (_.isEmpty(this.state.image))
      ? constants.defaultProfileImage
      : this.state.image.path;
    var profileImageStyle = {
      backgroundImage: 'url(' + profileImage + ')',
    };

    return (
      <div className='profile-dropdown-container'>
        <div className='backdrop' onClick={ this.toggle }></div>
        <div className='arrow' />
        <div className='profile-dropdown'>
          <div className="profile-top">
            <div className="profile-picture overlay">
              <Uploader
                onUploadComplete={ this.onUploadComplete }
                className="profile-image-dropzone"
                style={ profileImageStyle }
                dropzoneOptions={ dropzoneOptions }
                tooltip='Change Profile Picture'
              />
            </div>
            <div className="profile-details">
              <span className='profile-name'>{ user.displayName }</span>
              <span className='profile-email'>{ user.email }</span>
              <span className='profile-points'>{ user.points }&nbsp;Points</span>
            </div>
          </div>
          <FlatButton
            label="Logout"
            linkButton={ true }
            href='/logout'
            style={{ marginRight: 10 }}
          />
        </div>
      </div>
    );
  },

  render() {
    var profileImageURL = (_.isEmpty(this.state.image))
      ? constants.defaultProfileImage
      : this.state.image.path;
    var profileImageStyle = {
      backgroundImage: 'url(' + profileImageURL + ')',
    }

    var buttonStyle = {
      backgroundImage: 'url(' + profileImageURL + ')',
      marginRight: 0
    };

    return (
      <div ref='Container' style={{ position: 'relative' }}>
        <Button
          ref='ProfileButton'
          className='profile-btn'
          onClick={ this.toggle }
          style={ buttonStyle }
          title='Profile'
        />
        <Overlay
          show={ this.props.show }
          target={ (props) => ReactDOM.findDOMNode(this.refs.ProfileButton) }
          placement='bottom'
          container={ this.container }
        >
          { this.renderOverlay() }
        </Overlay>
      </div>
    );
  }
});

module.exports = ProfileDropdown;
