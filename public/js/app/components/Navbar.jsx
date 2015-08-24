/**
 * Navbar.jsx
 *
 * The top navbar of the application
 * automatically added to every page, no matter
 * what the route is (see index.js)
 *
 * @author albert
 * @author kevin
 */

'use strict';

// imports
var React = require('react');
var _ = require('underscore');

var router = require('./../../router');

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

var BevyDropdown = require('./../../bevy/components/BevyDropdown.jsx');
var ProfileDropdown = require('./../../profile/components/ProfileDropdown.jsx');
var NotificationDropdown = require('./../../notification/components/NotificationDropdown.jsx');
var ChatDropdown = require('./../../chat/components/ChatDropdown.jsx');
var ChatDock = require('./../../chat/components/ChatDock.jsx');
var ChatSidebar = require('./../../chat/components/ChatSidebar.jsx');
var ThemeManager = new Styles.ThemeManager();
var user = window.bootstrap.user;

// react component
var Navbar = React.createClass({

  propTypes: {
    myBevies: React.PropTypes.array.isRequired,
    activeBevy: React.PropTypes.object,
    allNotifications: React.PropTypes.array
  },

  getInitialState() {
    return {
      activeTab: null,
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

  onKeyUp(ev) {
    if(ev.which == 13) {
      // trigger search
      this.onSearch(ev);
    }
  },

  onChange(ev) {
    this.onSearch(ev);
  },

  onSearch(ev) {
    ev.preventDefault();
    var query = this.refs.search.getValue();
    router.navigate('s/' + query, { trigger: true });
  },

  _renderUserDropdowns() {
    if(_.isEmpty(window.bootstrap.user)) {
      return <a className="navbar-brand navbar-brand-text" href='/login'> Log In </a>;
    }

    var counter = (this.props.allNotifications.length <= 0)
    ? ''
    : <Badge className='notification-counter'>{ notificationCount }</Badge>;

    var chatSidebar = <ChatSidebar />;
    var chatDock = <ChatDock />;

    if(router.current == 'home') {
      chatSidebar = <div />;
      chatDock = <div />;
    }

    return (
      <div className='profile-buttons'>
        {chatSidebar}
        {chatDock}
        <ChatDropdown 
          show={ this.state.activeTab == 'chat' }
          onToggle={() => {
            this.setState({
              activeTab: (this.state.activeTab == 'chat') ? null : 'chat'
            });
          }}
        />
        <NotificationDropdown
          allNotifications={ this.props.allNotifications }
          show={ this.state.activeTab == 'notifications' }
          onToggle={() => {
            this.setState({
              activeTab: (this.state.activeTab == 'notifications') ? null : 'notifications'
            });
          }}
        />
        { counter }
        <ProfileDropdown 
          show={ this.state.activeTab == 'profile' }
          onToggle={() => {
            this.setState({
              activeTab: (this.state.activeTab == 'profile') ? null : 'profile'
            });
          }}
        />
      </div>
    );
  },

  render() {

    var navbarStyle;
    if(!_.isEmpty(this.props.activeBevy) && !_.isEmpty(this.props.activeBevy.image_url))
      navbarStyle = { backgroundColor: 'rgba(0,0,0,0)'};
    if(router.current == 'home')
      navbarStyle = { boxShadow: 'none'};

    var backgroundStyle = {backgroundColor: '#2cb673'};

    var navbarTitle = '';
    switch(router.current) {
      case 'home':
        navbarTitle = '';
        break;
      case 'bevy':
        navbarTitle = this.props.activeBevy.name;
        var backgroundStyle = (_.isEmpty(this.props.activeBevy))
          ? {}
          : { 
            opacity: this.state.opacity,
            backgroundImage: 'url(' + this.props.activeBevy.image_url + ')' 
          };
        break;
      case 'search':
        navbarTitle = ((_.isEmpty(router.search_query)) ? 'all bevies' : 'search for ' + router.search_query);
        break;
      default:
        break;
    }

    return (
      <div id='navbar' className="navbar navbar-fixed-top row" style={ navbarStyle }>
        <div className='background-wrapper' style={ _.isEmpty(this.props.activeBevy.image_url) ? { backgroundColor: '#2CB673' } : { backgroundColor: '#000' }}>
          <div className="background-image" style= { backgroundStyle } />
        </div>
        <div className="navbar-header pull-left">
          <Button className="bevy-logo-btn" href={ (_.isEmpty(window.bootstrap.user)) ? '/bevies' : '/' }>
            <div className='bevy-logo-img'/>
          </Button>
          <BevyDropdown
            myBevies={ this.props.myBevies }
            activeBevy={ this.props.activeBevy }
          />
        </div>

        <div className="nav navbar-brand-text nav-center">
          { navbarTitle }
        </div>

        <div className="navbar-header pull-right">
          <form className="navbar-form navbar-right" role="search">
            <TextField
              type='text'
              className='search-input'
              ref='search'
              onChange={ this.onChange }
              defaultValue={ router.search_query || '' }
            />
            <IconButton
              iconClassName='glyphicon glyphicon-search'
              onClick={ this.onSearch }
              style={{ width: '35px', height: '35px', padding: '5px', margin: '3px' }}
              iconStyle={{ color: 'white', fontSize: '14px' }}
            />
          </form>
          { this._renderUserDropdowns() }
        </div>
      </div>
    );
  }
});

Navbar.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = Navbar;
