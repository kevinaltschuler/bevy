/**
 * ChatDropdown.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var {
  Button
} = require('react-bootstrap');
var {
  TextField
} = require('material-ui');

var ThreadItem = require('./ThreadItem.jsx');
var UserSearchItem = require('./UserSearchItem.jsx');

var ChatActions = require('./../ChatActions');
var ChatStore = require('./../ChatStore');
var UserActions = require('./../../profile/UserActions');
var UserStore = require('./../../profile/UserStore');

var mui = require('material-ui');
var TextField = mui.TextField;
var ThemeManager = new mui.Styles.ThemeManager();

var constants = require('./../../constants');
var USER = constants.USER;
var CHAT = constants.CHAT;

var user = window.bootstrap.user;
var email = user.email;

var ChatSidebar = React.createClass({

  propTypes: {
    allContacts: React.PropTypes.array,
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object,
    userSearchResults: React.PropTypes.array,
    userSearchQuery: React.PropTypes.string
  },

  getChildContext() { 
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  componentWillMount() {
    ThemeManager.setComponentThemes({
        textField: {
          textColor: 'rgba(0,0,0,.87)',
          focusColor: 'rgba(0,0,0,.4)'
        }
      });
  },

  getInitialState() {
    return {
      allThreads: [],

      sidebarWidth: constants.chatSidebarWidthClosed,
      searchHeight: 0,
      isOverlayOpen: false,
      searching: false,
      query: '',
      searchUsers: []
    };
  },

  componentDidMount() {
    ChatStore.on(CHAT.CHANGE_ALL, this.handleChangeAll);
    UserStore.on(USER.SEARCH_COMPLETE, this.handleSearchResults);
    UserStore.on(USER.SEARCHING, this.handleSearching);
  },

  componentWillUnmount() {
    ChatStore.off(CHAT.CHANGE_ALL, this.handleChangeAll);
    UserStore.off(USER.SEARCH_COMPLETE, this.handleSearchResults);
    UserStore.off(USER.SEARCHING, this.handleSearching);
  },

  handleChangeAll() {
    this.setState({
      allThreads: ChatStore.getAllThreads()
    });
  },

  handleSearching() {
    this.setState({
      searching: true,
      searchUsers: []
    });
  },

  handleSearchResults() {
    this.setState({
      searching: false,
      query: UserStore.getUserSearchQuery(),
      searchUsers: UserStore.getUserSearchResults()
    });
  },

  handleToggle(ev) {
    ev.preventDefault();
    this.setState({
      isOverlayOpen: !this.state.isOverlayOpen
    });
  },

  openSearchResults() {
    this.setState({
      searchHeight: constants.chatSidebarSearchHeight
    });
  },

  closeSearchResults() {
    // clear search query and results
    // and reset height
    this.setState({
      searchHeight: 0,
      query: '',
      searchUsers: []
    });
    // blur text field
    this.refs.userSearch.blur();
  },

  onChange(ev) {
    ev.preventDefault();
<<<<<<< HEAD
    if(this.refs.userSearch.getValue() != '') {
      UserActions.search(this.refs.userSearch.getValue());
    }
=======
    var query = this.refs.userSearch.getValue();
    this.setState({
      query: query
    });
    if(_.isEmpty(query)) return;
    else UserActions.search(query);
>>>>>>> 6ff41a833a5a220e1f1143e7868f89fa6caea9ca
  },

  render() {
    var threads = [];
    var allThreads = this.state.allThreads;
    for(var key in allThreads) {
      var thread = allThreads[key];
<<<<<<< HEAD
      var bevy = thread.bevy;
      var user = window.bootstrap.user;

      var latestMessage = ChatStore.getLatestMessage(thread._id);
      var message = '';
      if(!_.isEmpty(latestMessage)) {

        if(bevy) {

          var messageAuthor = latestMessage.author.displayName;
          if(latestMessage.author._id == user._id) messageAuthor = 'Me';

          message = (
            <span className='latest-message'>
              { messageAuthor + ': ' + latestMessage.body }
            </span>
          );
        } else {

          var messageAuthor = latestMessage.author.displayName;
          if(latestMessage.author._id == user._id) messageAuthor = 'Me';

          message = (
            <span className='latest-message'>
              { messageAuthor + ': ' + latestMessage.body }
            </span>
          );
        }
      }

      var image_url = (bevy) ? bevy.image_url : '';
      if(_.isEmpty(image_url)) {
        if(bevy) image_url = '/img/logo_100.png';
        else image_url = '/img/user-profile-icon.png';
      }
      var imageStyle = {
        backgroundImage: 'url(' + image_url + ')',
        backgroundSize: 'auto 100%',
        backgroundPosition: 'center'
      };

=======
>>>>>>> 6ff41a833a5a220e1f1143e7868f89fa6caea9ca
      threads.push(
        <ThreadItem
          key={ 'sidebarthread' + thread._id }
          thread={ thread }
        />
      );
    }

    if(threads.length <= 0) {
      console.log('no threads');
      return <div/>;
    };

    var searchResults = [];
    var userSearchResults = this.state.searchUsers;
    for(var key in userSearchResults) {

      var user = userSearchResults[key];
      
      searchResults.push(
        <UserSearchItem
          key={ 'chatusersearch:' + user._id }
          searchUser={ user }
        />
      );
    }

<<<<<<< HEAD
    if(_.isEmpty(searchResults) && !_.isEmpty(this.props.userSearchQuery)) {
      searchResults = (
      <div className='no-results'>
=======
    if(_.isEmpty(searchResults) && !_.isEmpty(this.state.query)) {
      searchResults = <div>
>>>>>>> 6ff41a833a5a220e1f1143e7868f89fa6caea9ca
        <h3>
          no results :(
        </h3>
      </div>);
    }

<<<<<<< HEAD
    if(this.props.userSearchQuery == 'a8d27dc165db909fcd24560d62760868') {
      searchResults = (
      <div className='loading'>
        <section className="loaders">
          <span className="loader loader-quart"></span>
        </section>
      </div>);
    }

    //console.log('results: ', this.props.userSearchResults);
   // console.log('query: ', this.props.userSearchQuery);

=======
    if(this.state.searching) {
      searchResults = <section className="loaders"><span className="loader loader-quart"> </span></section>
    }

>>>>>>> 6ff41a833a5a220e1f1143e7868f89fa6caea9ca
    return (
      <div 
        className='chat-sidebar' 
        style={{ width: this.state.sidebarWidth }}
        onMouseOver={() => { 
          this.setState({ sidebarWidth: constants.chatSidebarWidthOpen }); 
        }}
        onMouseOut={() => { 
          //this.closeSearchResults();
          this.setState({ sidebarWidth: constants.chatSidebarWidthClosed }); 
        }}
      >
        <div className='conversation-list'>
          <div className='title'>
          </div>
          { threads }
        </div>
        <div 
          className='search-results'
          style={{ 
            width: constants.chatSidebarWidthOpen,
            height: this.state.searchHeight
          }}
        >
          <div className='content' >
            <div className='results-list'>
              <span className='results-list-header'>Users</span>
              { searchResults }
            </div>
          </div>
          <div className='topline-wrapper'>
            <div className='topline'/>
          </div>
        </div>
        <div className='chat-actions'>
          <span className='glyphicon glyphicon-search' />
          <TextField 
<<<<<<< HEAD
            onFocus={this.openSearchResults} 
            onBlur={this.closeSearchResults}
            type='text'
            className='search-input'
            ref='userSearch'
            onChange={ this.onChange }
            defaultValue={ this.props.searchQuery }
            style={{margin: '0px 5px 0px 5px'}}
=======
            onFocus={ this.openSearchResults } 
            //onBlur={this.closeSearchResults}
            type='text'
            className='search-input'
            ref='userSearch'
            value={ this.state.query }
            onChange={ this.onChange }
            hintText='Search Users'
>>>>>>> 6ff41a833a5a220e1f1143e7868f89fa6caea9ca
          />
        </div>
      </div>
    );
  }
});

  ChatSidebar.childContextTypes = {
    muiTheme: React.PropTypes.object
  };

module.exports = ChatSidebar;
