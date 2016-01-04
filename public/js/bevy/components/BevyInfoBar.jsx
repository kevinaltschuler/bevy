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
  IconButton,
  FlatButton
} = require('material-ui');
var Uploader = require('./../../shared/components/Uploader.jsx');
var InviteUsersModal = require('./InviteUsersModal.jsx');
var BevySettingsModal = require('./BevySettingsModal.jsx');

var _ = require('underscore');
var BevyActions = require('./../BevyActions');

var BevyInfoBar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      isAdmin: (_.findWhere(this.props.activeBevy.admins, { _id: window.bootstrap.user._id }) != undefined),
      showSettingsModal: false,
      showInviteModal: false,
      showAdminModal: false
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isAdmin: (_.findWhere(nextProps.activeBevy.admins, { _id: window.bootstrap.user._id }) != undefined),
    });
  },

  onUploadComplete(file) {
    var bevy_id = this.props.activeBevy.id;
    var name = this.props.activeBevy.name;
    BevyActions.update(bevy_id, name, file);
  },

  _renderPublicPrivate() {
    if(this.props.activeBevy.settings.privacy == 'Public') {
      return (
        <div className='info-item'>
          <OverlayTrigger placement='bottom' overlay={
            <Tooltip id='publictooltip'>Public</Tooltip>
          }>
            <span className='info-item-body'>
              <i className="material-icons">public</i>
            </span>
          </OverlayTrigger>
        </div>
      );
    } else {
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='privatetooltip'>Private</Tooltip>
        }>
          <span className='info-item-body'>
            <i className="material-icons">lock</i>
          </span>
        </OverlayTrigger>
      </div>
    }
  },

  _renderSubs() {
    return (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='subtooltip'>
            { this.props.activeBevy.subCount + ' ' + (
              (this.props.activeBevy.subCount == 1)
                ? 'subscriber'
                : 'subscribers'
            ) }
          </Tooltip>
        }>
          <FlatButton
            label={ this.props.activeBevy.subCount }
            labelPosition='after'
            style={{
              minWidth: 0,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0)',
              color: '#FFF',
              fontSize: '1em',
              textShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
              paddingLeft: 4,
              paddingRight: 4
            }}
            labelStyle={{
              padding: 0,
              marginRight: 4
            }}
          >
            <i className="material-icons">people</i>
          </FlatButton>
        </OverlayTrigger>
      </div>
    );
  },

  _renderAdmins() {
    return (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='adminstooltip'>
            { this.props.activeBevy.admins.length }
            &nbsp;
            { (this.props.activeBevy.admins.length == 1)
              ? 'admin'
              : 'admins' }
          </Tooltip>
        }>
          <FlatButton
            label={ this.props.activeBevy.admins.length }
            labelPosition='after'
            style={{
              minWidth: 0,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0)',
              color: '#FFF',
              fontSize: '1em',
              textShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
              paddingLeft: 4,
              paddingRight: 4
            }}
            labelStyle={{
              padding: 0
            }}
          >
            <i className="material-icons">person</i>
          </FlatButton>
        </OverlayTrigger>
      </div>
    );
  },

  _renderSettingsButton() {
    if(!this.state.isAdmin) return <div />;
    return (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='settingstooltip'>Bevy Settings</Tooltip>
        }>
          <IconButton
            onClick={() => this.setState({ showSettingsModal: true })}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              height: 24,
              width: 24,
              padding: 0,
              marginTop: 0,
              textShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)'
            }}
          >
            <span className='info-item-body'>
              <i className="material-icons">settings</i>
            </span>
          </IconButton>
        </OverlayTrigger>
      </div>
    );
  },

  _renderImageButton() {
    if(!this.state.isAdmin) return <div />;
    return (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='imagetooltip'>Change Bevy Image</Tooltip>
        }>
          <IconButton
            className='change-image-button'
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              height: 24,
              width: 24,
              padding: 0,
              marginTop: 0,
              textShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)'
            }}
          >
            <span className='info-item-body'>
              <i className="material-icons">camera_alt</i>
            </span>
          </IconButton>
        </OverlayTrigger>
      </div>
    );
  },

  _renderInviteButton() {
    if(!this.state.isAdmin) return <div />;
    return (
      <div className='info-item'>
        <Uploader
          onUploadComplete={ this.onUploadComplete }
          className="bevy-image-dropzone"
          dropzoneOptions={{
            maxFiles: 1,
            acceptedFiles: 'image/*',
            clickable: '.change-image-button',
            dictDefaultMessage: ' ',
            init: function() {
              this.on("addedfile", function() {
                if(this.files[1]!=null) {
                  this.removeFile(this.files[0]);
                }
              });
            }
          }}
          tooltip='Change Bevy Picture'
          style={{ display: 'none' }}
        />
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='invitetooltip'>Invite Users</Tooltip>
        }>
          <IconButton
            onClick={() => this.setState({ showInviteModal: true })}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              height: 24,
              width: 24,
              padding: 0,
              marginTop: 0,
              textShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)'
            }}
          >
            <span className='info-item-body'>
              <i className="material-icons">person_add</i>
            </span>
          </IconButton>
        </OverlayTrigger>
      </div>
    );
  },

  render() {
    var bevy = this.props.activeBevy;
    if(_.isEmpty(bevy)) return <div/>;

    return (
      <div className='bevy-info-bar'>
        { this._renderPublicPrivate() }
        { this._renderSubs() }
        { this._renderAdmins() }
        { this._renderImageButton() }
        { this._renderInviteButton() }
        { this._renderSettingsButton() }
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

      </div>
    );
  }
});

module.exports = BevyInfoBar;
