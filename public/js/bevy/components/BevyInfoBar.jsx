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
  Tooltip,
  Badge
} = require('react-bootstrap');
var Ink = require('react-ink');
var InviteUsersModal = require('./InviteUsersModal.jsx');
var BevySettingsModal = require('./BevySettingsModal.jsx');

var _ = require('underscore');
var constants = require('./../../constants');

var BevyActions = require('./../../bevy/BevyActions');
var BevyStore = require('./../../bevy/BevyStore');
var AppActions = require('./../../app/AppActions');

var BevyInfoBar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      isAdmin: _.findWhere(this.props.activeBevy.admins, { _id: window.bootstrap.user._id }) != undefined,
      showSettingsModal: false,
      showInviteModal: false
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isAdmin: _.findWhere(nextProps.activeBevy.admins, { _id: window.bootstrap.user._id }) != undefined,
    });
  },

  leaveBevy() {
    if(window.confirm('Are you sure?')) {
      BevyActions.leave(this.props.activeBevy);
    }
  },

  openMemberDirectory() {
    AppActions.openSidebar('directory', {
      initialDirectoryTab: 'member'
    });
  },

  openAdminDirectory() {
    AppActions.openSidebar('directory', {
      initialDirectoryTab: 'admin'
    });
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
      return (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='privatetooltip'>Private</Tooltip>
        }>
          <span className='info-item-body'>
            <i className="material-icons">lock</i>
          </span>
        </OverlayTrigger>
      </div>
      )
    }
  },

  _renderSubs() {
    let subCount = this.props.activeBevy.subCount;
    //let subCountUnit = (subCount == 1) ? 'member' : 'members';

    return (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='subtooltip'>
            { subCount + ' ' + ((subCount == 1) ? 'member' : 'members') }
          </Tooltip>
        }>
          <button
            className='bevy-info-button'
            title='View Group Directory'
            onClick={ this.openMemberDirectory }
          >
            <Ink
              opacity={ 0.25 }
              style={{ color: '#FFF' }}
            />
            <span className='number'>{ subCount }</span>
            <i className="material-icons">people</i>
          </button>
        </OverlayTrigger>
      </div>
    );
  },

  _renderAdmins() {
    let adminCount = this.props.activeBevy.admins.length;

    return (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='adminstooltip'>
            { adminCount + ' ' + ((adminCount == 1) ? 'admin' : 'admins') }
          </Tooltip>
        }>
          <button
            className='bevy-info-button'
            title='View Bevy Admins'
            onClick={ this.openAdminDirectory }
          >
            <Ink
              opacity={ 0.25 }
              style={{ color: '#FFF' }}
            />
            <span className='number'>{ adminCount }</span>
            <i className="material-icons">person</i>
          </button>
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
          <button
            className='bevy-info-button'
            title='Open Bevy Settings'
            onClick={() => this.setState({ showSettingsModal: true })}
          >
            <Ink
              opacity={ 0.25 }
              style={{ color: '#FFF' }}
            />
            <i className="material-icons">settings</i>
          </button>
        </OverlayTrigger>
      </div>
    );
  },

  _renderInviteButton() {
    if(!this.state.isAdmin) return <div />;
    return (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='invitetooltip'>Invite Users</Tooltip>
        }>
          <button
            className='bevy-info-button'
            onClick={() => this.setState({ showInviteModal: true })}
            title='Invite Users'
          >
            <Ink
              opacity={ 0.25 }
              style={{ color: '#FFF' }}
            />
            <i className="material-icons">person_add</i>
          </button>
        </OverlayTrigger>
      </div>
    );
  },

  render() {
    if(_.isEmpty(this.props.activeBevy)) return <div/>;

    return (
      <div className='bevy-info-bar'>
        { this._renderPublicPrivate() }
        { this._renderSubs() }
        { this._renderAdmins() }
        { this._renderInviteButton() }
        { this._renderSettingsButton() }
        <BevySettingsModal
          show={ this.state.showSettingsModal }
          onHide={() => this.setState({ showSettingsModal: false })}
          activeBevy={ this.props.activeBevy }
        />
        <InviteUsersModal
          show={ this.state.showInviteModal }
          onHide={() => this.setState({ showInviteModal: false })}
          activeBevy={ this.props.activeBevy }
        />
      </div>
    );
  }
});

module.exports = BevyInfoBar;
