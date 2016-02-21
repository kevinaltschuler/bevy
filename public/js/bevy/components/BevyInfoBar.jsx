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
var {
  IconButton,
  FlatButton
} = require('material-ui');
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
      isAdmin: (_.contains(this.props.activeBevy.admins, window.bootstrap.user._id)),
      showSettingsModal: false,
      showInviteModal: false
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isAdmin: (_.contains(nextProps.activeBevy.admins, window.bootstrap.user._id)),
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
    return (
      <div className='info-item'>
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='subtooltip'>
            { this.props.activeBevy.subCount + ' ' + (
              (this.props.activeBevy.subCount == 1)
                ? 'member'
                : 'members'
            ) }
          </Tooltip>
        }>
          <FlatButton
            label={ this.props.activeBevy.subCount }
            labelPosition='before'
            title='View Bevy Subscribers'
            onClick={ this.openMemberDirectory }
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
            labelPosition='before'
            title='View Bevy Admins'
            onClick={ this.openAdminDirectory }
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
            title='Change Bevy Settings'
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

  _renderInviteCounter() {
    var invites = BevyStore.getInvites();
    if(invites.length <= 0) return <div />;
    return (
      <Badge className='invite-counter'>
        { invites.length }
      </Badge>
    );
  },

  _renderInviteButton() {
    if(!this.state.isAdmin) return <div />;
    return (
      <div className='info-item'>
        { this._renderInviteCounter() }
        <OverlayTrigger placement='bottom' overlay={
          <Tooltip id='invitetooltip'>Invite Users</Tooltip>
        }>
          <IconButton
            onClick={() => this.setState({ showInviteModal: true })}
            title='Invite Users'
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
