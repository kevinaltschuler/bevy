/**
 * MainSection.jsx
 *
 * the main react component of the app. shows posts and allows
 * the user to switch bevys
 *
 * @author albert
 */

'use strict';

// imports
var React = require('react');
var _ = require('underscore');
var router = require('./../../router');

var Navbar = require('./Navbar.jsx');
var HomeView = require('./../../homepage/components/HomeView.jsx');
var PostView = require('./PostView.jsx');
var BevyView = require('./../../bevy/components/BevyView.jsx');
var FourOhFour = require('./FourOhFour.jsx');
var SearchView = require('./SearchView.jsx');
var MyBevies = require('./MyBevies.jsx');
var Frontpage = require('./Frontpage.jsx');

var BoardStore = require('./../../board/BoardStore');
var PostStore = require('./../../post/PostStore');
var BevyStore = require('./../../bevy/BevyStore');
var NotificationStore = require('./../../notification/NotificationStore');
var UserStore = require('./../../profile/UserStore');

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

// create app
var MainSection = React.createClass({

  // called directly after mounting
  getInitialState: function() {
    return this.collectState();
  },

  // mount event listeners
  componentDidMount: function() {
    PostStore.on(change_all_events, this._onPostChange);
    BevyStore.on(change_all_events, this._onBevyChange);
    NotificationStore.on(change_all_events, this._onNotificationChange);
    UserStore.on(change_all_events, this._onUserChange);
    BoardStore.on(change_all_events, this._onBoardChange);
    
    UserStore.on(USER.LOADED, AppActions.load());
  },

  // unmount event listeners
  componentWillUnmount: function() {
    PostStore.off(change_all_events, this._onPostChange);
    BevyStore.off(change_all_events, this._onBevyChange);
    NotificationStore.off(change_all_events, this._onNotificationChange);
    UserStore.off(change_all_events, this._onUserChange);
    BoardStore.off(change_all_events, this._onBoardChange);
  },

  getPostState: function() {
    return {
      sortType: PostStore.getSort(),
      frontBevies: PostStore.getFrontBevies()
    }
  },

  getBevyState: function() {

    var myBevies = BevyStore.getMyBevies();
    var active = BevyStore.getActive();
    var publicBevies = BevyStore.getPublicBevies();
    var bevyBoards = BevyStore.getBevyBoards();

    return {
      // later, load this from session/cookies
      myBevies: myBevies,
      activeBevy: active,
      publicBevies: publicBevies,
      boards: bevyBoards,
      //activeTags: activeTags
    }
  },

  getNotificationState: function() {
    return {
      allNotifications: NotificationStore.getAll()
    };
  },

  getUserState: function() {
    return {
      user: UserStore.getUser(),
      loggedIn: UserStore.getLoggedIn()
    };
  },

  getBoardState: function() {
    return {
      //boards: BoardStore.getBoards(),
      activeBoard: BoardStore.getActive()
    };
  },

  collectState: function() {
    var state = {};
    _.extend(state,
      this.getPostState(),
      this.getBevyState(),
      this.getNotificationState(),
      this.getUserState(),
      this.getBoardState()
    );
    return state;
  },

  // event listener callbacks
  _onPostChange: function() {
    this.setState(_.extend(this.state, this.getPostState()));
  },
  _onBevyChange: function() {
    this.setState(_.extend(this.state, this.getBevyState()));
  },
  _onNotificationChange: function() {
    this.setState(_.extend(this.state, this.getNotificationState()));
  },
  _onUserChange: function() {
    this.setState(_.extend(this.state, this.getUserState()));
  },
  _onBoardChange: function() {
    this.setState(_.extend(this.state, this.getBoardState()));
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this.collectState());
  },

  render: function() {
    return (
      <div className='main-section-wrapper'>
        <Navbar
          activeBevy={ this.state.activeBevy }
          allNotifications={ this.state.allNotifications }
          myBevies={ this.state.myBevies }
          linkedAccounts={ this.state.linkedAccounts }
          activeBoard={ this.state.activeBoard }
        />
        <InterfaceComponent {...this.state} />
      </div>
    );
  }
});

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

    if(_.isEmpty(localStorage.getItem("access_token"))) {
      console.log('ITS EMPTY');
      return <div/>;
    }

    console.log(localStorage.getItem("access_token"));

    switch(router.current) {
      case 'home': 
        return <HomeView {...this.props}  />
        break;
      case 'myBevies':
        return <MyBevies {...this.props } />
        break;
      case 'search':
        return <SearchView {...this.props} />
        break;
      case 'bevy':
        return <BevyView {...this.props} />
        break;
      case 'board':
        return <PostView {...this.props} />
        break;
      default:
        return <FourOhFour {...this.props} />
        break;
    }
  }
});

// pipe back to index.js
module.exports = MainSection;
