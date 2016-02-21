/**
 * Sidebar.jsx
 *
 * Inner component for the materiak ui left navbar
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var Ink = require('react-ink');

var UserSidebar = require('./../../user/components/UserSidebar.jsx');
var DirectoryView = require('./../../user/components/DirectoryView.jsx');
var ProfileView = require('./../../user/components/ProfileView.jsx');

var _ = require('underscore');
var constants = require('./../../constants');

var AppStore = require('./../../app/AppStore');
var AppActions = require('./../../app/AppActions');

var APP = constants.APP;

var pages = 'home profile directory'.split(' ');

var Sidebar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    leftNavActions: React.PropTypes.object
  },

  getInitialState() {
    return {
      page: 'home',
      profileUser: {},
      initialDirectoryTab: 'member'
    };
  },

  componentDidMount() {
    AppStore.on(APP.OPEN_SIDEBAR, this.openSidebarRequest);
  },
  componentWillUnmount() {
    AppStore.off(APP.OPEN_SIDEBAR, this.openSidebarRequest);
  },

  openSidebarRequest(payload) {
    let page = payload.page;
    let opts = payload.opts;
    let newState = { page: page };

    if(opts.profileUser != undefined)
      newState.profileUser = opts.profileUser;
    if(opts.initialDirectoryTab != undefined)
      newState.initialDirectoryTab = opts.initialDirectoryTab;

    this.setState(newState);
    this.props.leftNavActions.open();
  },

  switchPage(page, profileUser) {
    this.setState({
      page: page,
      profileUser: (profileUser == undefined) ? {} : profileUser
    });
  },

  renderPage() {
    let sidebarActions = {
      switchPage: this.switchPage
    };

    switch(this.state.page) {
      case 'home':
        return (
          <UserSidebar
            activeBevy={ this.props.activeBevy }
            leftNavActions={ this.props.leftNavActions }
            sidebarActions={ sidebarActions }
          />
        );
        break;
      case 'profile':
        return (
          <ProfileView
            activeBevy={ this.props.activeBevy }
            leftNavActions={ this.props.leftNavActions }
            sidebarActions={ sidebarActions }
            profileUser={ this.state.profileUser }
          />
        );
        break;
      case 'directory':
        return (
          <DirectoryView
            activeBevy={ this.props.activeBevy }
            leftNavActions={ this.props.leftNavActions }
            sidebarActions={ sidebarActions }
            initialDirectoryTab={ this.state.initialDirectoryTab }
          />
        );
        break;
    }
  },

  render() {
    if(_.isEmpty(window.bootstrap.user)) return <div />;

    return (
      <div
        className='sidebar-container'
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          height: '100%'
        }}
      >
        { this.renderPage() }
      </div>
    );
  }
});

module.exports = Sidebar;
