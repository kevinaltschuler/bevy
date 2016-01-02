/**
 * BevyInfoBar.jsx
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  Button,
  OverlayTrigger,
  Tooltip
} = require('react-bootstrap');

var {
  IconButton
} = require('material-ui');

var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var BevySettingsModal = require('./BevySettingsModal.jsx');
var BevyActions = require('./../BevyActions');
var InviteUsersModal = require('./InviteUsersModal.jsx');

var BevyInfoBar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      showSettingsModal: false,
      showInviteModal: false
    }
  },

  onUploadComplete(file) {

    var bevy_id = this.props.activeBevy.id;
    var name = this.props.activeBevy.name;

    BevyActions.update(bevy_id, name, file);
  },

  render() {
    var bevy = this.props.activeBevy;
    if(_.isEmpty(bevy)) {
        return <div/>;
    }
    var publicPrivate = (bevy.settings.privacy == 'Private')
    ?  (<div className='info-item'>
          <OverlayTrigger placement='bottom' overlay={<Tooltip id='privatetooltip'>Private</Tooltip>}>
            <i className="material-icons">lock</i>
          </OverlayTrigger>
        </div>
      )
    : (<div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={<Tooltip id='publictooltip'>Public</Tooltip>}>
          <i className="material-icons">public</i>
        </OverlayTrigger>
      </div>
    );

    var subs = (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={<Tooltip id='subtooltip'>{bevy.subCount + " subscribers"}</Tooltip>}>
          <i className="material-icons">people</i>
        </OverlayTrigger>
      </div>
    );

    var admins = (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={<Tooltip id='adminstooltip'>{ bevy.admins.length }&nbsp;{ (bevy.admins.length == 1) ? 'admin' : 'admins' }</Tooltip>}>
          <i className="material-icons">person</i>
        </OverlayTrigger>
      </div>
    );

    var settingsButton = (
      <div className='info-item'>
        <IconButton onClick={() => this.setState({showSettingsModal: true})} style={{height: 30, width: 24, padding: 0, marginTop: -2, textShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)'}}>
          <i className="material-icons">settings</i>
        </IconButton>
      </div>
    );

    var dropzoneOptions = {
      maxFiles: 1,
      acceptedFiles: 'image/*',
      clickable: '.dropzone-panel-button',
      dictDefaultMessage: ' ',
      init: function() {
        this.on("addedfile", function() {
          if (this.files[1]!=null){
            this.removeFile(this.files[0]);
          }
        });
      }
    };

    var imageButton = (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={<Tooltip id='imagetooltip'>Change Image</Tooltip>}>
          <IconButton className='dropzone-panel-button' style={{height: 30, width: 24, padding: 0, marginTop: -2, textShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)'}}>
            <i className="material-icons">camera_alt</i>
          </IconButton>
        </OverlayTrigger>
      </div>
    );

    var inviteButton = (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={<Tooltip id='invitetooltip'>Invite Users</Tooltip>}>
          <IconButton onClick={() => this.setState({showInviteModal: true})} style={{height: 30, width: 24, padding: 0, marginTop: -2, textShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)'}}>
            <i className="material-icons">person_add</i>
          </IconButton>
        </OverlayTrigger>
      </div>
    );

    if(!_.findWhere(bevy.admins, {_id: window.bootstrap.user._id})) {
      settingsButton = <div/>;
      imageButton = <div/>;
      inviteButton = <div/>;
    }

    return (
      <div className='bevy-info-bar'>   
        {publicPrivate}
        {subs}
        {admins}
        {imageButton}
        {inviteButton}
        {settingsButton}
        <BevySettingsModal
          show={this.state.showSettingsModal}
          onHide={() => this.setState({showSettingsModal: false})}
          activeBevy={bevy}
        />
        <InviteUsersModal
          show={this.state.showInviteModal}
          onHide={() => this.setState({showInviteModal: false})}
          activeBevy={bevy}
        />
        <Uploader
          onUploadComplete={ this.onUploadComplete }
          className="bevy-image-dropzone"
          dropzoneOptions={ dropzoneOptions }
          tooltip='Change Bevy Picture'
          style={{display: 'none'}}
        />
      </div>
    );
  }
});

module.exports = BevyInfoBar;
