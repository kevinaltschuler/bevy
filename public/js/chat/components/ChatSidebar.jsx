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
  Button,
  Accordion,
  PanelGroup,
  Panel
} = require('react-bootstrap');
var {
  TextField,
  Styles,
  CircularProgress
} = require('material-ui');

var ThreadItem = require('./ThreadItem.jsx');
var UserSearchItem = require('./UserSearchItem.jsx');

var user = window.bootstrap.user;
var email = user.email;
var constants = require('./../../constants');
var USER = constants.USER;
var CHAT = constants.CHAT;
var ChatActions = require('./../ChatActions');
var ChatStore = require('./../ChatStore');
var UserActions = require('./../../profile/UserActions');
var UserStore = require('./../../profile/UserStore');

var ThemeManager = new Styles.ThemeManager();

var ChatSidebar = React.createClass({

  propTypes: {
    allThreads: React.PropTypes.array,
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
      allThreads: ChatStore.getAllThreads(),
      sidebarWidth: (window.innerWidth >= 1545) ? constants.chatSidebarWidthOpen : constants.chatSidebarWidthClosed,
      searchHeight: 0,
      isOverlayOpen: false,
      searching: false,
      query: '',
      searchUsers: [],
      bevyPanelOpen: true,
      groupPanelOpen: true,
      pmPanelOpen: true
    };
  },

  handleResize(e) {
    if(window.innerWidth <= 1545) {
      this.setState({
        sidebarWidth: constants.chatSidebarWidthClosed
      });
    } else {
      this.setState({
        sidebarWidth: constants.chatSidebarWidthOpen
      });
    }
  },

  componentDidMount() {
    ChatStore.on(CHAT.CHANGE_ALL, this.handleChangeAll);
    UserStore.on(USER.SEARCH_COMPLETE, this.handleSearchResults);
    UserStore.on(USER.SEARCHING, this.handleSearching);
    window.addEventListener('resize', this.handleResize);
    this.node = React.findDOMNode(this.refs.ConversationList);
  },

  componentWillUnmount() {
    ChatStore.off(CHAT.CHANGE_ALL, this.handleChangeAll);
    UserStore.off(USER.SEARCH_COMPLETE, this.handleSearchResults);
    UserStore.off(USER.SEARCHING, this.handleSearching);
    window.removeEventListener('resize', this.handleResize);
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
  },

  onChange(ev) {
    ev.preventDefault();
    var query = this.refs.userSearch.getValue();
    if(_.isEmpty(query)) {
      this.setState({
        query: '',
        searching: false,
        searchUsers: []
      });
      this.closeSearchResults();
      return;
    }
    this.setState({
      query: query,
      searching: true
    });
    if(_.isEmpty(query)) {
     this.closeSearchResults();
     return;
   }
    else { 
      this.openSearchResults();
      if(this.searchTimeout != undefined) {
        clearTimeout(this.searchTimeout);
        delete this.searchTimeout;
      }
      this.searchTimeout = setTimeout(this.searchUsers, 500);
    }
  },

  searchUsers() {
    this.setState({
      searching: true
    });
    UserActions.search(this.state.query);
  },

  openSidebar() {
    this.setState({ sidebarWidth: constants.chatSidebarWidthOpen });
  },

  closeSidebar() {
    this.setState({ sidebarWidth: constants.chatSidebarWidthClosed });
  },

  onMouseOver() {
    if(this.closeDelay != undefined) {
      clearTimeout(this.closeDelay);
      delete this.closeDelay;
    }
    this.openDelay = setTimeout(this.openSidebar, 500);
  },

  onMouseOut() {
    if(this.openDelay != undefined) {
      clearTimeout(this.openDelay);
      delete this.openDelay;
    }
    this.closeDelay = setTimeout(this.closeSidebar, 500);
  },

  _renderThreads() {
    var allThreads = _.map(this.state.allThreads, ($thread) => $thread); // create deep copy
    allThreads = _.reject(allThreads, ($thread) => $thread._id == -1); // dont render the new message panel/thread
    if(allThreads.length == 0) return <div>no conversations</div>;

    // collect and render all thread items - sorted by type
    var bevyThreads = _.where(allThreads, { type: 'bevy' });
    var bevyThreadItems = [];
    var sidebarOpen = (this.state.sidebarWidth == constants.chatSidebarWidthOpen)
    for(var key in bevyThreads) {
      var thread = bevyThreads[key];
      bevyThreadItems.push(
        <ThreadItem
          key={ 'sidebar:bevythread:' + thread._id }
          width={ this.state.sidebarWidth }
          thread={ thread }
          sidebarOpen={ sidebarOpen }
          showTooltip={ true }
        />
      );
    };
    var groupThreads = _.where(allThreads, { type: 'group' });
    var groupThreadItems = [];
    for(var key in groupThreads) {
      var thread = groupThreads[key];
      groupThreadItems.push(
        <ThreadItem
          key={ 'sidebar:groupthread:' + thread._id }
          width={ this.state.sidebarWidth }
          thread={ thread }
          sidebarOpen={ sidebarOpen }
          showTooltip={ true }
        />
      );
    };
    var pmThreads = _.where(allThreads, { type: 'pm' });
    var pmThreadItems = [];
    for(var key in pmThreads) {
      var thread = pmThreads[key];
      pmThreadItems.push(
        <ThreadItem
          key={ 'sidebar:pmthread:' + thread._id }
          width={ this.state.sidebarWidth }
          thread={ thread }
          sidebarOpen={ sidebarOpen }
          showTooltip={ true }
        />
      );
    };
    var hideTitles = (this.state.sidebarWidth == constants.chatSidebarWidthOpen) ? {opacity: 1} : {opacity: 0};
    var shiftPanels = (this.state.sidebarWidth == constants.chatSidebarWidthOpen) ? { marginTop: 0 } : { marginTop: -40 }
    var shiftBevyPanel = (this.state.sidebarWidth == constants.chatSidebarWidthOpen) ? { marginTop: 0 } : { marginTop: -30 }
    var bevyPanel = (bevyThreadItems.length > 0) ? (
      <div className='threads-title' style={ shiftBevyPanel }>
        <a className='title' href='#' style={ hideTitles } onClick={(ev) => {
          ev.preventDefault();
          this.setState({ bevyPanelOpen: !this.state.bevyPanelOpen });
        }}>bevy conversations</a>
        <Panel collapsible expanded={ this.state.bevyPanelOpen }>
          { bevyThreadItems }
        </Panel>
      </div>
    ) : <div />;
    var groupPanel = (groupThreadItems.length > 0) ? (
      <div className='threads-title' style={ shiftPanels }>
        <a className='title' href='#' style={ hideTitles } onClick={(ev) => {
          ev.preventDefault();
          this.setState({ groupPanelOpen: !this.state.groupPanelOpen });
        }}>group conversations</a>
        <Panel collapsible expanded={ this.state.groupPanelOpen } >
          { groupThreadItems }
        </Panel>
      </div>
    ) : <div />;
    var pmPanel = (pmThreadItems.length > 0) ? (
      <div className='threads-title' style={ shiftPanels }>
        <a className='title' href='#' style={ hideTitles } onClick={(ev) => {
          ev.preventDefault();
          this.setState({ pmPanelOpen: !this.state.pmPanelOpen });
        }}>private conversations</a>
        <Panel collapsible expanded={ this.state.pmPanelOpen }>
          { pmThreadItems }
        </Panel>
      </div>
    ) : <div />;
    return (
      <div className='threads-container' style={{ width: constants.chatSidebarWidthOpen }}>
        { bevyPanel }
        { groupPanel }
        { pmPanel }
      </div>
    );
  },

  render() {
    if(_.isEmpty(this.state.allThreads)) return <div />;

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

    if(_.isEmpty(searchResults) && !_.isEmpty(this.state.query) && !this.state.searching) {
      searchResults = (
        <span className='no-results'>
          no results :(
        </span>
      );
    }

    if(this.state.searching) {
      searchResults = <div className='loading-indeterminate'><CircularProgress mode="indeterminate" /></div>
    }

    return (
      <div 
        className='chat-sidebar' 
        style={{ 
          width: constants.chatSidebarWidthOpen,
          right: this.state.sidebarWidth - constants.chatSidebarWidthOpen
        }}
        onMouseOver={() => { 
          this.onMouseOver();
        }}
        onMouseOut={() => { 
          if(window.innerWidth <= 1545)
            this.onMouseOut();
        }}
      >
        <div className='conversation-list' ref='ConversationList' onWheel={(ev) => {
          // stop scroll from bubbling up
          ev.preventDefault();
          this.node = React.findDOMNode(this.refs.ConversationList);
          var scrollTop = this.node.scrollTop;
          if(ev.deltaY > 0) {
            scrollTop += 50;
          } else {
            scrollTop -= 50;
          }
          if(scrollTop < 0) scrollTop = 0;
          if(scrollTop > (this.node.scrollHeight - this.node.offsetHeight))
            scrollTop = this.node.scrollHeight - this.node.offsetHeight;
          this.node.scrollTop = scrollTop;
        }}>
          { this._renderThreads() }
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
          <Button className='glyphicon glyphicon-search' onClick={this.openSidebar}/>
          <TextField 
            type='text'
            className='search-input'
            ref='userSearch'
            value={ this.state.query }
            onChange={ this.onChange }
            hintText='Search Users'
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
