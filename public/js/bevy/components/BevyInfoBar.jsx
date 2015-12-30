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

var BevyInfoBar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      showSettingsModal: false
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
    ?  (
        <OverlayTrigger placement='bottom' overlay={<Tooltip>Private</Tooltip>}>
          <i className="material-icons">lock</i>
        </OverlayTrigger>
      )
    : (
      <OverlayTrigger placement='bottom' overlay={<Tooltip>Public</Tooltip>}>
        <i className="material-icons">public</i>
      </OverlayTrigger>
    );

    var subs = (
      <OverlayTrigger placement='bottom' overlay={<Tooltip>{bevy.subCount + " subscribers"}</Tooltip>}>
        <i className="material-icons">people</i>
      </OverlayTrigger>
    );

    var admins = (
      <OverlayTrigger placement='bottom' overlay={<Tooltip>{ bevy.admins.length }&nbsp;{ (bevy.admins.length == 1) ? 'admin' : 'admins' }</Tooltip>}>
      <i className="material-icons">person</i>
      </OverlayTrigger>
    );

    var settingsButton = (
      <IconButton onClick={() => this.setState({showSettingsModal: true})} style={{height: 30, width: 24, padding: 0, marginTop: -2, textShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)'}}>
        <i className="material-icons">settings</i>
      </IconButton>
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
      <IconButton className='dropzone-panel-button' style={{height: 30, width: 24, padding: 0, marginTop: -2, textShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)'}}>
        <i className="material-icons">camera_alt</i>
      </IconButton>
    );

    if(!_.findWhere(bevy.admins, {_id: window.bootstrap.user._id})) {
      settingsButton = <div/>;
      imageButton = <div/>;
    }

    return (
      <div className='bevy-info-bar'>
        <div className='info-item'>
            {publicPrivate}
        </div>
        <div className='info-item'>
            {subs}
        </div>
        <div className='info-item'>
            {admins}
        </div>
        <div className='info-item'>
            {settingsButton}
        </div>
        <div className='info-item'>
            {imageButton}
        </div>
        <BevySettingsModal
          show={this.state.showSettingsModal}
          onHide={() => this.setState({showSettingsModal: false})}
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
