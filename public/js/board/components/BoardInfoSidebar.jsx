/**
 * BoardInfoSidebar.jsx
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var Ink = require('react-ink');
var BoardSettingsModal = require('./BoardSettingsModal.jsx');
var AddAdminModal = require('./../../user/components/AddAdminModal.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var resizeImage = require('./../../shared/helpers/resizeImage');
var timeAgo = require('./../../shared/helpers/timeAgo');

var AppActions = require('./../../app/AppActions');

let BoardInfoSidebar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object
  },

  getInitialState() {
    return {
      isAdmin: (this.props.activeBoard == undefined)
        ? false
        : _.findWhere(this.props.activeBoard.admins, { _id: window.bootstrap.user._id }) != undefined,
      showSettingsModal: false,
      showAdminModal: false
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isAdmin: (nextProps.activeBoard == undefined)
        ? false
        : _.findWhere(nextProps.activeBoard.admins, { _id: window.bootstrap.user._id }) != undefined
    })
  },

  onAdminClick(admin) {
    AppActions.openSidebar('profile', { profileUser: admin });
  },

  showAdminModal(ev) {
    ev.preventDefault();
    this.setState({ showAdminModal: true });
  },
  hideAdminModal(ev) {
    //ev.preventDefault();
    this.setState({ showAdminModal: false });
  },

  showSettingsModal(ev) {
    ev.preventDefault();
    this.setState({ showSettingsModal: true });
  },
  hideSettingsModal(ev) {
    //ev.preventDefault();
    this.setState({ showSettingsModal: false });
  },

  renderType() {
    let type;
    switch(this.props.activeBoard.type) {
      case 'discussion':
        type = (
          <div className='type'>
            <i style={{marginRight: 10}} className="material-icons">question_answer</i>
            <span className='type-text'>Discussion Board</span>
          </div>
        );
        break;
      case 'announcement':
        type = (
          <div className='type'>
            <i style={{marginRight: 10}} className="material-icons">flag</i>
            <span className='type-text'>Announcements Board</span>
          </div>
        );
        break;
      default:
        type = <div />;
        break;
    }
    return type;
  },

  renderAdmins() {
    let adminItems = [];
    for(var key in this.props.activeBoard.admins) {
      let admin = this.props.activeBoard.admins[key];
      adminItems.push(
        <AdminItem
          key={ 'admin-item:' + key }
          admin={ admin }
          onClick={ this.onAdminClick }
        />
      );
    }
    return (
      <div className='admins'>
        <AddAdminModal
          show={ this.state.showAdminModal }
          onHide={ this.hideAdminModal }
          activeBoard={ this.props.activeBoard }
          activeBevy={ this.props.activeBevy }
        />
        <div className='admins-header'>
          <span className='admins-title'>
            Admins ({ this.props.activeBoard.admins.length })
          </span>
          <button
            className='add-button'
            title='Add an admin to this board'
            onClick={ this.showAdminModal }
          >
            <span className='text'>
              Add Board Admin
            </span>
          </button>
        </div>
        { adminItems }
      </div>
    )
  },

  renderSettingsButton() {
    if(!this.state.isAdmin) return <div />;
    return (
      <div className='settings-container'>
        <BoardSettingsModal
          board={ this.props.activeBoard }
          show={ this.state.showSettingsModal }
          onHide={ this.hideSettingsModal }
        />
        <button
          className='settings-button'
          title='Board Settings'
          onClick={ this.showSettingsModal }
        >
          <Ink />
          <span className='settings-button-text'>Board Settings</span>
        </button>
      </div>
    );
  },

  render() {
    if(this.props.activeBoard._id == undefined || !this.props.open) return <div />;
    return (
      <div className='board-info-sidebar'>
        <div
          className='header-image'
          style={{
            backgroundImage: 'url(' + resizeImage(this.props.activeBoard.image, 640, 300).url + ')'
          }}
        >
          <button
            className='close-button'
            onClick={ this.props.toggleSidebar }
            title='Close Board Info'
          >
            <Ink />
            <i className="material-icons">close</i>
          </button>
        </div>
        <span className='name'>
          { this.props.activeBoard.name }
        </span>
        { this.renderType() }
        <span className='description'>
          { (this.props.activeBoard.description.length <= 0)
              ? 'No description' : this.props.activeBoard.description }
        </span>
        <span className='created'>
          Created { timeAgo(Date.parse(this.props.activeBoard.created)) }
        </span>
        { this.renderAdmins() }
        { this.renderSettingsButton() }
      </div>
    );
  }
});

let AdminItem = React.createClass({
  propTypes: {
    admin: React.PropTypes.object,
    onClick: React.PropTypes.func
  },

  onClick(ev) {
    ev.preventDefault();
    this.props.onClick(this.props.admin);
  },

  render() {
    return (
      <button
        className='admin-item'
        title={ this.props.admin.displayName }
        onClick={ this.onClick }
      >
        <Ink />
        <div
          className='image'
          style={{
            backgroundImage: 'url(' + resizeImage(this.props.admin.image, 128, 128).url + ')'
          }}
        />
        <span className='name'>
          { this.props.admin.displayName }
        </span>
      </button>
    );
  }
});

module.exports = BoardInfoSidebar;
