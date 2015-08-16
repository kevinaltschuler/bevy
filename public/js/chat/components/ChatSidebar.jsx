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

var ChatActions = require('./../ChatActions');
var ChatStore = require('./../ChatStore');
var UserActions = require('./../../profile/UserActions');
var UserStore = require('./../../profile/UserStore');
var constants = require('./../../constants');
var USER = constants.USER;

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

  getInitialState() {
    return {
      sidebarWidth: constants.chatSidebarWidthClosed,
      isOverlayOpen: false,
      searching: false,
      query: '',
      searchUsers: []
    };
  },

  componentDidMount() {
    UserStore.on(USER.SEARCH_COMPLETE, this.handleSearchResults);
    UserStore.on(USER.SEARCHING, this.handleSearching);
  },

  componentWillUnmount() {
    UserStore.off(USER.SEARCH_COMPLETE, this.handleSearchResults);
    UserStore.off(USER.SEARCHING, this.handleSearching);
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

  openUserThread(ev) {
    ev.preventDefault();

    var thread_id = ev.target.getAttribute('id');

    ChatActions.openThread(null, thread_id);
  },

  openSearchResults() {
    document.getElementById("search-results").style.height = "300px";
  },

  closeSearchResults() {
    document.getElementById("search-results").style.height = "0px";
  },

  onChange(ev) {
    ev.preventDefault();
    var query = this.refs.userSearch.getValue();
    if(_.isEmpty(query)) return;
    else UserActions.search(query);
  },

  render() {
    var threads = [];
    var allThreads = (_.isEmpty(this.props.allThreads)) ? [] : this.props.allThreads;
    for(var key in allThreads) {
      var thread = allThreads[key];
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
      var image_url = (_.isEmpty(user.image_url)) ? '/img/user-profile-icon.png' : user.image_url;

      var name = user.displayName;

      var imageStyle = {
        backgroundImage: 'url(' + image_url + ')',
        backgroundSize: 'auto 100%',
        backgroundPosition: 'center'
      };

      searchResults.push(
        <Button className='conversation-item' key={ 'thread' + user._id } id={ user._id } onFocus={ this.openUserThread }>
          <div className='image' style={imageStyle}/>
          <div className='conversation-details'>
            <span className='bevy-name'>{ name }</span>
          </div>
        </Button>
      );
    }

    if(_.isEmpty(searchResults) && !_.isEmpty(this.state.query)) {
      searchResults = <div>
        <h3>
          no results :(
        </h3>
      </div>
    }

    if(this.state.searching) {
      searchResults = <section className="loaders"><span className="loader loader-quart"> </span></section>
    }

    return (
      <div 
        className='chat-sidebar' 
        style={{ width: this.state.sidebarWidth }}
        onMouseOver={() => { this.setState({ sidebarWidth: constants.chatSidebarWidthOpen }); }}
        onMouseOut={() => { this.setState({ sidebarWidth: constants.chatSidebarWidthClosed }); }}
      >
        <div className='conversation-list'>
          <div className='title'>
          </div>
          { threads }
        </div>
        <div 
          className='search-results'
          style={{ width: constants.chatSidebarWidthOpen }}
          id='search-results'
        >
          <div className='content' >
            <div className='top'>
            </div>
            <div className='results-list'>
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
            onFocus={this.openSearchResults} 
            onBlur={this.closeSearchResults}
            type='text'
            className='search-input'
            ref='userSearch'
            onChange={ this.onChange }
            defaultValue={ this.props.searchQuery }
          />
        </div>
      </div>
    );
  }
});
module.exports = ChatSidebar;
