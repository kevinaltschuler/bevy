/**
 * DirectoryView.jsx
 *
 * view to view and search through all the members of a bevy
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  Panel,
  Input
} = require('react-bootstrap');
var {
  TextField,
  CircularProgress,
  RaisedButton
} = require('material-ui');
var Ink = require('react-ink');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var resizeImage = require('./../../shared/helpers/resizeImage');

var UserActions = require('./../../user/UserActions');
var UserStore = require('./../../user/UserStore');

var USER = constants.USER;

let DirectoryView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    leftNavActions: React.PropTypes.object,
    sidebarActions: React.PropTypes.object,
    initialDirectoryTab: React.PropTypes.string
  },

  getInitialState() {
    return {
      loadingInitial: (_.isEmpty(this.props.activeBevy)),
      query: '',
      searching: false,
      searchUsers: [],
      searchError: '',
      activeTab: (this.props.initialDirectoryTab == undefined)
        ? 'member' : this.props.initialDirectoryTab
    };
  },

  componentWillReceiveProps(nextProps) {
    if(!_.isEmpty(nextProps.activeBevy)) {
      this.setState({ loadingInitial: false });
      this.search();
    }
    if(nextProps.initialDirectoryTab != undefined) {
      this.switchTab(nextProps.initialDirectoryTab);
    }
  },

  componentDidMount() {
    if(!_.isEmpty(this.props.activeBevy)) {
      this.search();
    }

    UserStore.on(USER.SEARCHING, this.onSearching);
    UserStore.on(USER.SEARCH_COMPLETE, this.onSearchComplete);
  },
  componentWillUnmount() {
    UserStore.off(USER.SEARCHING, this.onSearching);
    UserStore.off(USER.SEARCH_COMPLETE, this.onSearchComplete);
  },

  onSearching() {
    this.setState({ searching: true });
  },
  onSearchComplete() {
    this.setState({
      searching: false,
      searchUsers: UserStore.getUserSearchResults()
    });
  },

  onSearchChange() {
    let query = this.refs.search.getValue();
    this.setState({ query: query });
    if(this.searchTimeout != undefined) {
      clearTimeout(this.searchTimeout);
      delete this.searchTimeout;
    }
    this.searchTimeout = setTimeout(this.search, 500);
  },

  onUserClick(user) {
    this.props.sidebarActions.switchPage('profile', user);
  },

  close() {
    this.props.leftNavActions.close();
  },

  clearQuery() {
    this.setState({ query: '' });
    this.search();
  },

  search() {
    UserActions.search(
      this.state.query, // search query
      this.props.activeBevy._id, // bevy _id
      this.state.activeTab // user role
    );
  },

  switchTab(tab) {
    this.setState({ activeTab: tab });
    // account for asynchronous state
    setTimeout(this.search, 100);
  },

  renderLoading() {

  },

  renderSearchLoading() {
    if(this.state.searching) {
      return (
        <div className='loading-container'>
          <CircularProgress
            mode='indeterminate'
            color='#AAA'
            size={ 0.35 }
          />
        </div>
      );
    } else return <div />;
  },

  renderUsers() {
    let userItems = [];
    for(var key in this.state.searchUsers) {
      let user = this.state.searchUsers[key];
      userItems.push(
        <DirectoryItem
          key={ 'directoryitem:' + key }
          user={ user }
          onClick={ this.onUserClick }
        />
      );
    }

    if(userItems.length <= 0 && this.state.query.length > 0) {
      userItems = (
        <div className='not-found-container'>
          <span className='not-found-text'>
            { 'No group members matched the term "' + this.state.query + '"' }
          </span>
          <button
            className='clear-query-button'
            title='Clear search query'
            onClick={ this.clearQuery }
          >
            <span>Clear Search</span>
          </button>
        </div>
      );
    }

    return (
      <div className='user-items'>
        { userItems }
      </div>
    );
  },

  render() {
    return (
      <div className='directory-view'>
        <div className='top-bar'>
          <span className='title'>Group Directory</span>
          <button
            className='close-button'
            title='Close Group Directory'
            onClick={ this.close }
          >
            <i className='material-icons'>close</i>
          </button>
        </div>
        <div className='search-container'>
          <Input
            ref='search'
            value={ this.state.query }
            type='text'
            onChange={ this.onSearchChange }
            placeholder='Search group directory'
            addonBefore={
              <i className='material-icons'>search</i>
            }
          />
          { this.renderSearchLoading() }
        </div>
        <div className='search-tabs'>
          <button
            className='tab'
            title='Search group members'
            onClick={() => { this.switchTab('member') }}
          >
            <span className='text'>
              Members ({ this.props.activeBevy.subCount })
            </span>
            <div
              className='bottom-bar'
              style={{
                visibility: (this.state.activeTab == 'member')
                  ? 'visible' : 'hidden'
              }}
            />
          </button>
          <button
            className='tab'
            title='Search group admins'
            onClick={() => { this.switchTab('admin') }}
          >
            <span className='text'>
              Admins ({ this.props.activeBevy.admins.length })
            </span>
            <div
              className='bottom-bar'
              style={{
                visibility: (this.state.activeTab == 'admin')
                  ? 'visible' : 'hidden'
              }}
            />
          </button>
        </div>
        { this.renderUsers() }
      </div>
    )
  }
});

let DirectoryItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    onClick: React.PropTypes.func
  },

  getInitialState() {
    return {

    };
  },

  onClick() {
    this.props.onClick(this.props.user);
  },

  renderBigName() {
    let name = this.props.user.username;
    if(!_.isEmpty(this.props.user.fullName)) {
      name = this.props.user.fullName;
    }
    return <span className='big-name'>{ name }</span>;
  },
  renderSmallName() {
    if(_.isEmpty(this.props.user.fullName)) return <div />;
    return <span className='small-name'>{ this.props.user.username }</span>
  },
  renderTitle() {
    if(_.isEmpty(this.props.user.title)) return <div />;
    return <span className='title'>{ this.props.user.title }</span>
  },

  render() {
    let profileImageURL = (_.isEmpty(this.props.user.image))
      ? constants.defaultProfileImage
      : resizeImage(this.props.user.image, 128, 128).url;

    return (
      <button
        className='directory-item'
        title={ 'View ' + this.props.user.username + "'s Profile" }
        onClick={ this.onClick }
      >
        <div
          className='image'
          style={{ backgroundImage: 'url(' + profileImageURL + ')' }}
        />
        <div className='details'>
          { this.renderBigName() }
          { this.renderSmallName() }
          { this.renderTitle() }
        </div>
      </button>
    );
  }
});

module.exports = DirectoryView;
