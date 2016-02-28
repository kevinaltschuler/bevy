/**
 * MainSection.jsx
 *
 * the main react component of the app. shows posts and allows
 * the user to switch bevys
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var Navbar = require('./Navbar.jsx');
var Sidebar = require('./Sidebar.jsx');
var {
  LeftNav
} = require('material-ui');

var _ = require('underscore');
var router = require('./../../router');
var PostStore = require('./../../post/PostStore');
var BevyStore = require('./../../bevy/BevyStore');
var NotificationStore = require('./../../notification/NotificationStore');
var UserStore = require('./../../user/UserStore');
var AppActions = require('./../../app/AppActions');
var constants = require('./../../constants');

var POST = constants.POST;
var BEVY = constants.BEVY;
var NOTIFICATION = constants.NOTIFICATION;
var USER = constants.USER;
var BOARD = constants.BOARD;

var change_all_events = [
  POST.CHANGE_ALL,
  BEVY.CHANGE_ALL,
  NOTIFICATION.CHANGE_ALL,
  USER.CHANGE_ALL,
  BOARD.CHANGE_ALL
].join(' ');

var MainSection = React.createClass({
  getInitialState() {
    return this.collectState();
  },

  componentDidMount() {
    AppActions.loadUser();

    PostStore.on(change_all_events, this._onPostChange);
    BevyStore.on(change_all_events, this._onBevyChange);
    NotificationStore.on(change_all_events, this._onNotificationChange);
    UserStore.on(change_all_events, this._onUserChange);

    UserStore.on(USER.LOADED, AppActions.load());
  },
  componentWillUnmount() {
    PostStore.off(change_all_events, this._onPostChange);
    BevyStore.off(change_all_events, this._onBevyChange);
    NotificationStore.off(change_all_events, this._onNotificationChange);
    UserStore.off(change_all_events, this._onUserChange);
  },

  getPostState() {
    return {
      sortType: PostStore.getSort()
    }
  },

  getBevyState() {
    var active = BevyStore.getActive();
    var bevyBoards = BevyStore.getBevyBoards();
    var activeBoard = BevyStore.getActiveBoard();

    return {
      activeBevy: active,
      boards: bevyBoards,
      activeBoard: activeBoard
    };
  },

  getNotificationState() {
    return {
      allNotifications: NotificationStore.getAll(),
      userInvites: NotificationStore.getUserInvites()
    };
  },

  getUserState() {
    return {
      user: UserStore.getUser(),
      loggedIn: UserStore.getLoggedIn()
    };
  },

  collectState() {
    var state = {
      leftNavOpen: false
    };
    _.extend(state,
      this.getPostState(),
      this.getBevyState(),
      this.getNotificationState(),
      this.getUserState()
    );
    return state;
  },

  // event listener callbacks
  _onPostChange() {
    this.setState(_.extend(this.state, this.getPostState()));
  },
  _onBevyChange() {
    this.setState(_.extend(this.state, this.getBevyState()));
  },
  _onNotificationChange() {
    this.setState(_.extend(this.state, this.getNotificationState()));
  },
  _onUserChange() {
    this.setState(_.extend(this.state, this.getUserState()));
  },

  componentWillReceiveProps(nextProps) {
    this.setState(this.collectState());
  },

  openLeftNav() {
    this.setState({ leftNavOpen: true });
  },
  closeLeftNav() {
    this.setState({ leftNavOpen: false });
  },
  toggleLeftNav() {
    this.setState({ leftNavOpen: !this.state.leftNavOpen });
  },

  render() {

    if(!UserStore.getTokensLoaded() && router.current != 'home') {
      console.log('tokens not loaded');
      //return <div/>;
    }

    let leftNavActions = {
      open: this.openLeftNav,
      close: this.closeLeftNav,
      toggle: this.toggleLeftNav
    };

    return (
      <div className='main-section-wrapper'>
        <LeftNav
          width={ 300 }
          openRight={ true }
          open={ this.state.leftNavOpen }
          docked={ false }
          onRequestChange={open => this.setState({ leftNavOpen: open })}
          style={{
            backgroundColor: '#EEE',
            overflowY: 'hidden'
          }}
        >
          <Sidebar
            activeBevy={ this.state.activeBevy }
            leftNavActions={ leftNavActions }
          />
        </LeftNav>
        <InterfaceComponent
          leftNavActions={ leftNavActions }
          {...this.state}
        />
      </div>
    );
  }
});

var HomeView = require('./../../homepage/components/HomeView.jsx');
var BevyView = require('./../../bevy/components/BevyView.jsx');
var FourOhFour = require('./FourOhFour.jsx');
var PostView = require('./PostView.jsx');
var CreateBevyPage = require('./../../bevy/components/CreateBevyPage.jsx');
var EditProfileView = require('./../../user/components/EditProfileView.jsx');
var DirectoryView = require('./../../user/components/DirectoryView.jsx');

var InterfaceComponent = React.createClass({
  callback() {
    this.forceUpdate();
  },
  componentWillMount() {
    router.on('route', this.callback);
  },
  componentWillUnmount() {
    router.off('route', this.callback);
  },
  render() {
    switch(router.current) {
      case 'home':
        return <HomeView {...this.props}  />;
        break;
      case 'bevy':
        return <BevyView {...this.props} />;
        break;
      case 'board':
        return <BevyView {...this.props} />;
        break;
      case 'post':
        return <BevyView { ...this.props } />;
        break;
      case 'edit-profile':
        return <EditProfileView { ...this.props } />;
        break;
      case 'directory':
        return <DirectoryView { ...this.props } />;
        break;
      default:
        return <div>SOMETHING WENT REALLY REALLY WRONG</div>
        break;
    }
  }
});

// pipe back to index.js
module.exports = MainSection;
