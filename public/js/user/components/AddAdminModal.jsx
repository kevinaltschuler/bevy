/**
 * AddAdminModal.jsx
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  Modal,
  Input
} = require('react-bootstrap');
var Ink = require('react-ink');

var _ = require('underscore');
var constants = require('./../../constants');
var resizeImage = require('./../../shared/helpers/resizeImage');
var UserActions = require('./../../user/UserActions');
var UserStore = require('./../../user/UserStore');

var USER = constants.USER;

var AddAdminModal = React.createClass({
  propTypes: {
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func,
    activeBoard: React.PropTypes.object,
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      query: '',
      searchUsers: [],
      searching: false
    };
  },

  componentWillReceiveProps(nextProps) {

  },

  componentDidMount() {
    UserStore.on(USER.SEARCHING, this.onSearching);
    UserStore.on(USER.SEARCH_COMPLETE, this.onSearchComplete);

    if(!_.isEmpty(this.props.activeBoard)) {
      this.search();
    }
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

  onQueryChange() {
    let query = this.refs.search.getValue();
    this.setState({ query: query });
    if(this.searchTimeout != undefined) {
      clearTimeout(this.searchTimeout);
      delete this.searchTimeout;
    }
    this.searchTimeout = setTimeout(this.search, 500);
  },

  onSearchItemClick(user) {

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

  hide() {
    this.setState(this.getInitialState());
    this.props.onHide();
  },

  renderSearchUsers() {
    let searchUserItems = [];
    for(var key in this.state.searchUsers) {
      let user = this.state.searchUsers[key];
      if(user._id == window.bootstrap.user._id) continue;
      if(_.findWhere(this.props.activeBoard.admins, { _id: user._id }) != undefined) continue;
      searchUserItems.push(
        <UserSearchItem
          key={ 'user-search-item:' + key }
          user={ user }
          onClick={ this.onSearchItemClick }
        />
      );
    }
    return (
      <div className='search-list'>
        { searchUserItems }
      </div>
    );
  },

  renderAdmins() {
    let adminItems = [];
    for(var key in this.props.activeBoard.admins) {
      let admin = this.props.activeBoard.admins[key];
      adminItems.push(
        <AdminItem
          key={ 'admin-item:' + key }
          user={ admin }
        />
      );
    }
    return (
      <div className='admin-list'>
        { adminItems }
      </div>
    );
  },

  render() {
    return (
      <Modal
        show={ this.props.show }
        onHide={ this.hide }
        className='add-admin-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add Admins to { this.props.activeBoard.name }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='add-admin-body'>
          <div className='left'>
            <div className='header'>
              <Input
                ref='search'
                type='text'
                value={ this.state.query }
                onChange={ this.onQueryChange }
                placeholder='Search Users'
                addonBefore={
                  <i className='material-icons'>search</i>
                }
              />
            </div>
            { this.renderSearchUsers() }
          </div>
          <div className='right'>
            <span className='title'>
              Admins
            </span>
            { this.renderAdmins() }
          </div>
        </Modal.Body>
      </Modal>
    );
  }
});

let UserSearchItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    onClick: React.PropTypes.func
  },

  onClick(ev) {
    ev.preventDefault();
    this.props.onClick(this.props.user);
  },

  render() {
    return (
      <button
        className='user-search-item'
        title={ this.props.user.displayName }
        onClick={ this.onClick }
      >
        <Ink />
        <i className='material-icons'>add</i>
        <div
          className='picture'
          style={{
            backgroundImage: 'url(' + resizeImage(this.props.user.image, 64, 64).url + ')'
          }}
        />
        <div className='details'>
          <span className='name'>
            { this.props.user.displayName }
          </span>
          <span className='email'>
            { this.props.user.email }
          </span>
        </div>
      </button>
    );
  },
});

let AdminItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },

  render() {
    return (
      <div
        className='admin-item'
        title={ this.props.user.displayName }
        onClick={ this.onClick }
      >
        <div
          className='picture'
          style={{
            backgroundImage: 'url(' + resizeImage(this.props.user.image, 64, 64).url + ')'
          }}
        />
        <div className='details'>
          <span className='name'>
            { this.props.user.displayName }
          </span>
          <span className='email'>
            { this.props.user.email }
          </span>
        </div>
      </div>
    );
  },
})

module.exports = AddAdminModal;
