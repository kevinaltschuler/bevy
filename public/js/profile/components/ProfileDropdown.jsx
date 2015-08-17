/**
 * ProfileDropdown.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var {
  Popover,
  DropdownButton,
  MenuItem,
  Button,
  Overlay
} = require('react-bootstrap');

var {
  FlatButton,
  TextField
} = require('material-ui');

var Uploader = require('./../../shared/components/Uploader.jsx');

var UserActions = require('./../UserActions');
var constants = require('./../../constants');

var user = window.bootstrap.user;


var ProfileDropdown = React.createClass({
  getInitialState() {
    return {
      show: false,
      image_url: (user.image_url) ? user.image_url : constants.defaultProfileImage
    }
  },

  onUploadComplete(file) {
    //console.log(file);
    var filename = file.filename;
    var image_url = constants.apiurl + '/files/' + filename;
    image_url += '?w=100&h=100';
    this.setState({
      image_url: image_url
    });

    UserActions.update(image_url);
  },

  onChange(ev) {
    this.setState({
      name: this.refs.name.getValue(),
    });
  },

  toggle(ev) {
    ev.preventDefault();

    this.setState({
      show: !this.state.show
    });
  },

  renderOverlay() {

    var name = user.displayName;
    var email = (_.isEmpty(user.google.name))
    ? ''
    : (<span className='profile-email'>{ user.email }</span>)

    var dropzoneOptions = {
      maxFiles: 1,
      acceptedFiles: 'image/*',
      clickable: '.dropzone-panel-button',
      dictDefaultMessage: ' ',
    };

    var profileImage;
    if(_.isEmpty(this.state.image_url)) {
      profileImage = defaultProfileImage;
      var profileImageStyle= {
        backgroundImage: 'url(' + profileImage + ')',
        backgroundSize: '75px 75px'
      };
    } else {
      profileImage =  this.state.image_url;
      var profileImageStyle = {
        backgroundImage: 'url(' + profileImage + ')',
      }
    }

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
              />
            </div>
            <div className="profile-details">
              <span className='profile-name'>{ name }</span>
              { email }
              <span className='profile-points'>123 points</span>
            </div>
            <div className="asdf">
              <DropdownButton
                noCaret
                pullRight
                className="profile-settings"
                title={<span className="glyphicon glyphicon-option-vertical btn"></span>}>
                <MenuItem>
                  Delete Account
                </MenuItem>
              </DropdownButton>
            </div>
          </div>
          <div className="profile-dropdown-buttons">
            <div className="profile-btn-right">
              <FlatButton
                label="Logout"
                linkButton={ true }
                href='/logout' />
            </div>
          </div>
        </div>
      </div>
    );
  },

  render() {

    var profileImage;
    if(_.isEmpty(this.state.image_url)) {
      profileImage = constants.defaultProfileImage;
      var profileImageStyle= {
        backgroundImage: 'url(' + profileImage + ')',
        backgroundSize: '75px 75px'
      };
    } else {
      profileImage =  this.state.image_url;
      var profileImageStyle = {
        backgroundImage: 'url(' + profileImage + ')',
      }
    }

    var buttonStyle = {
      backgroundImage: 'url(' + profileImage + ')'
    };

    return (
      <div ref='Container' style={{ position: 'relative' }}>
        <Button 
          ref='ProfileButton' 
          className='profile-btn' 
          onClick={ this.toggle } 
          style={ buttonStyle } 
        />
        <Overlay
          show={ this.state.show }
          target={ (props) => React.findDOMNode(this.refs.ProfileButton) }
          placement='bottom'
          container={ React.findDOMNode(this.refs.Container) }
        >
          { this.renderOverlay() }
        </Overlay>
      </div>
    );
  }
});
module.exports = ProfileDropdown;
