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

var BevyDropdown = require('./../../bevy/components/BevyDropdown.jsx');
var ProfileDropdown = require('./../../profile/components/ProfileDropdown.jsx');
var NotificationDropdown = require('./../../notification/components/NotificationDropdown.jsx');
var ChatDropdown = require('./../../chat/components/ChatDropdown.jsx');
var ChatDock = require('./../../chat/components/ChatDock.jsx');
var ChatSidebar = require('./../../chat/components/ChatSidebar.jsx');
var ThemeManager = new Styles.ThemeManager();

var _ = require('underscore');
var router = require('./../../router');
var user = window.bootstrap.user;
var BevyStore = require('./../../bevy/BevyStore');
var constants = require('./../../constants');
var BEVY = constants.BEVY;

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

  componentDidMount() {
    BevyStore.on(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
  },

  handleSearchComplete() {
    this.setState({
      searching: false
    });
  },

  onKeyUp(ev) {
    ev.preventDefault();
    if(ev.which == 13) {
      // trigger search
      this.onSearch();
      router.navigate('/s/' + this.refs.search.getValue(), { trigger: true });
    }
  },

  onChange(ev) {
    ev.preventDefault();
    this.setState({
      searching: true
    });
    if(this.searchTimeout != undefined) {
      clearTimeout(this.searchTimeout);
      delete this.searchTimeout;
    }
    this.searchTimeout = setTimeout(this.onSearch, 500);
  },

  onSearch() {
    if(router.current == 'search') // only auto navigate if we're already on the search page
      router.navigate('/s/' + this.refs.search.getValue(), { trigger: true });
  },

  _renderUserDropdowns() {
    if(_.isEmpty(window.bootstrap.user)) {
      return <a className="login-btn" href='/login'> Log In </a>;
    }

    var unread = _.reject(this.props.allNotifications, function(notification){ return notification.read });

    var counter = (unread.length <= 0)
    ? ''
    : <Badge className='notification-counter'>{ unread.length }</Badge>;

    var chatSidebar = <ChatSidebar />;
    var chatDock = <ChatDock />;

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
    if(router.current == 'home' && _.isEmpty(window.bootstrap.user))
      navbarStyle = { boxShadow: 'none'};

    var backgroundStyle = {backgroundColor: '#2cb673'};

    var navbarTitle = '';
    switch(router.current) {
      case 'home':
        navbarTitle = '';
        if(!_.isEmpty(window.bootstrap.user)) {
          navbarTitle = 'frontpage';
        }
        break;
        break;
      case 'bevy':
        navbarTitle = this.props.activeBevy.name;
        var backgroundStyle = (_.isEmpty(this.props.activeBevy))
          ? { filter: 'unset' }
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

    if(this.props.activeBevy.slug == 'sports' ||
      this.props.activeBevy.slug == 'gaming' ||
      this.props.activeBevy.slug == 'news' ||
      this.props.activeBevy.slug == 'videos' ||
      this.props.activeBevy.slug == 'pics' ||
      this.props.activeBevy.slug == 'books' ||
      this.props.activeBevy.slug == 'music')
        backgroundStyle = { backgroundColor: '#939393', filter: 'unset' };

    return (
      <div id='navbar' className="navbar" style={ navbarStyle }>
        <div className='background-wrapper' style={ _.isEmpty(this.props.activeBevy.image_url) ? { backgroundColor: '#939393' } : { backgroundColor: '#000' }}>
          <div className="background-image" style={ backgroundStyle } />
        </div>
        <div className="left">
          <Button className="bevy-logo-btn" title='Frontpage' href={ (!_.isEmpty(window.bootstrap.user)) ? '/b/frontpage' : '/' }>
            <div className='bevy-logo-img'/>
          </Button>
          <BevyDropdown
            myBevies={ this.props.myBevies }
            activeBevy={ this.props.activeBevy }
          />
        </div>

        <div className="center">
          <span className='title'>
            { navbarTitle }
          </span>
        </div>

        <div className="right">
          <TextField
            type='text'
            className='search-input'
            ref='search'
            onChange={ this.onChange }
            onKeyUp={ this.onKeyUp }
            defaultValue={ router.search_query || '' }
          />
          <IconButton
            iconClassName='glyphicon glyphicon-search'
            onClick={ this.onSearch }
            style={{ width: '35px', height: '35px', padding: '5px', margin: '3px' }}
            iconStyle={{ color: 'white', fontSize: '14px' }}
            title='Search'
          />
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
