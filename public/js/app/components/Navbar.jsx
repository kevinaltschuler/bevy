/**
 * Navbar.jsx
 *
 * The top navbar of the application
 * automatically added to every page, no matter
 * what the route is (see index.js)

 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var Ink = require('react-ink');
var {
  Button,
  DropdownButton,
  MenuItem,
  Badge
} = require('react-bootstrap');
var {
  IconButton,
  TextField,
  Styles
} = require('material-ui');
var ProfileDropdown = require('./../../profile/components/ProfileDropdown.jsx');
var NotificationDropdown = require('./../../notification/components/NotificationDropdown.jsx');
var ChatDropdown = require('./../../chat/components/ChatDropdown.jsx');
var ChatDock = require('./../../chat/components/ChatDock.jsx');
var ChatSidebar = require('./../../chat/components/ChatSidebar.jsx');
var BevyInfoBar = require('./../../bevy/components/BevyInfoBar.jsx');
var ThemeManager = new Styles.ThemeManager();

var _ = require('underscore');
var router = require('./../../router');
var user = window.bootstrap.user;
var BevyStore = require('./../../bevy/BevyStore');
var constants = require('./../../constants');
var BEVY = constants.BEVY;

var Navbar = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array.isRequired,
    activeBevy: React.PropTypes.object,
    allNotifications: React.PropTypes.array,
    userInvites: React.PropTypes.array,
    activeBoard: React.PropTypes.object
  },

  getInitialState() {
    return {
      activeTab: null,
      searching: false,
      opacity: 0.7 // the layer under the background image is black (rgba(0,0,0,1))
                   // this is the opacity for the image over that layer
                   // so higher opacity means a brighter image, and lower means darker
    };
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  componentWillMount() {
    ThemeManager.setComponentThemes({
      textField: {
        textColor: 'white',
        focusColor: 'white'
      }
    });
  },

  _renderBevyInfoBar() {
    if(router.current == 'bevy') {
      return (
        <BevyInfoBar
          activeBevy={ this.props.activeBevy }
        />
      );
    } else return <div />;
  },

  _renderUserDropdowns() {
    if(_.isEmpty(window.bootstrap.user)) {
      return <a className="login-btn" href='/login'> Log In </a>;
    }

    var userInvites = this.props.userInvites || [];

    var unread = _.reject(this.props.allNotifications, function(notification){
      return notification.read
    });
    var counter = (unread.length + userInvites.length <= 0)
      ? ''
      : (
        <Badge className='notification-counter'>
          { unread.length + userInvites.length }
        </Badge>
      );

    var chatSidebar = <ChatSidebar />;
    var chatDock = <ChatDock />;
    if(_.isEmpty(window.bootstrap.user)) {
      chatSidebar = '';
      chatDock = '';
    }

    return (
      <div className='profile-buttons'>
        { chatSidebar }
        { chatDock }
        <ChatDropdown
          show={ this.state.activeTab == 'chat' }
          onToggle={() => {
            this.setState({
              activeTab: (this.state.activeTab == 'chat')
                ? null
                : 'chat'
            });
          }}
        />
        <NotificationDropdown
          allNotifications={ this.props.allNotifications }
          userInvites={ this.props.userInvites }
          show={ this.state.activeTab == 'notifications' }
          onToggle={() => {
            this.setState({
              activeTab: (this.state.activeTab == 'notifications')
                ? null
                : 'notifications'
            });
          }}
        />
        { counter }
        <ProfileDropdown
          show={ this.state.activeTab == 'profile' }
          onToggle={() => {
            this.setState({
              activeTab: (this.state.activeTab == 'profile')
                ? null
                : 'profile'
            });
          }}
        />
      </div>
    );
  },

  render() {
    var navbarHeight = (router.current == 'bevy')
      ? '98px'
      : '68px';

    var navbarStyle;
    if(!_.isEmpty(this.props.activeBevy) && !_.isEmpty(this.props.activeBevy.image))
      navbarStyle = { backgroundColor: 'rgba(0,0,0,0)', height: navbarHeight};
    if(router.current == 'home')
      navbarStyle = { boxShadow: 'none', height: navbarHeight};

    var backgroundStyle = { backgroundColor: '#2cb673' };

    var navbarTitle = '';
    switch(router.current) {
      case 'home':
        navbarTitle = '';
        break;
      case 'myBevies':
        navbarTitle = 'My Bevies';
        break;
      case 'bevy':
        navbarTitle = this.props.activeBevy.name;
        backgroundStyle = (_.isEmpty(this.props.activeBevy))
          ? { filter: 'unset' }
          : {
            opacity: this.state.opacity,
            backgroundImage: (_.isEmpty(this.props.activeBevy.image))
              ? ''
              : 'url(' + this.props.activeBevy.image.path + ')',
          };
        if(!_.isEmpty(this.props.activeBevy)) {
          if(!_.isEmpty(this.props.activeBevy.image))
            if(this.props.activeBevy.image.path == "http://bevy.dev/img/default_group_img.png")
              backgroundStyle = {backgroundColor: 'rgba(129,129,129,1)'}
        }
        break;
      case 'board':
      case 'post':
        if(_.isEmpty(this.props.activeBoard.parent)) {
          return <div/>;
        }

        var parent = this.props.activeBoard.parent;
        if(parent.name == undefined || this.props.activeBoard.name == undefined)
          navbarTitle = '';
        else
          navbarTitle = (
            <div style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              <a
                href={ parent.url }
                style={{
                  color: '#fff'
                }}>
                { parent.name }
              </a>
              &nbsp;
              <span
                style={{fontSize: '.7em'}}
                className="glyphicon glyphicon-triangle-right"
              />
              &nbsp;
              <a
                href={ constants.siteurl + '/boards/' + router.board_id }
                style={{
                  color: '#fff'
                }}>
                { this.props.activeBoard.name }
              </a>
            </div>
          );

        backgroundStyle = (_.isEmpty(parent))
          ? { filter: 'unset' }
          : {
            opacity: this.state.opacity,
            backgroundImage: (_.isEmpty(parent.image))
              ? ''
              : 'url(' + parent.image.path + ')'
          };
          if(!_.isEmpty(parent)) {
            if(!_.isEmpty(parent.image))
              if(parent.image.path == "http://bevy.dev/img/default_group_img.png")
                backgroundStyle = {backgroundColor: 'rgba(129,129,129,1)'}
          }
        break;
      case 'search':
        navbarTitle = ((_.isEmpty(router.search_query))
          ? 'public bevies'
          : 'search for ' + router.search_query);
        break;
      default:
        break;
    }

    var searchButton = (_.isEmpty(window.bootstrap.user))
    ? <div/>
    : (<IconButton
          iconClassName='glyphicon glyphicon-search'
          linkButton={true}
          href='/s'
          style={{ width: '35px', height: '35px', padding: '5px', margin: '3px', marginLeft: '10px', paddingLeft: 12, paddingTop: 10 }}
          iconStyle={{ color: 'white', fontSize: '14px' }}
          title='Search'
        />);

    return (
      <div id='navbar' className="navbar" style={navbarStyle}>
        <div
          className='background-wrapper'
          style={ _.isEmpty(this.props.activeBevy.image)
            ? { backgroundColor: '#939393', height: navbarHeight }
            : { backgroundColor: '#000', height: navbarHeight }}
        >
        <div className="background-image" style={ backgroundStyle } />
        </div>
        <div className='content' style={{height: 68}}>
          <div className="left">
            <Button
              className="bevy-logo-btn"
              title='Frontpage'
              href='/'
            >
              <div className='bevy-logo-img'/>
            </Button>
            { searchButton}
          </div>

          <div className="center">
            <span className='title'>
              { navbarTitle }
            </span>
            { this._renderBevyInfoBar() }
          </div>

          <div className="right">
            { this._renderUserDropdowns() }
          </div>
        </div>
      </div>
    );
  }
});

Navbar.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = Navbar;
