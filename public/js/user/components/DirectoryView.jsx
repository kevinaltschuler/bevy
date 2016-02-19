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

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var resizeImage = require('./../../shared/helpers/resizeImage');

var UserActions = require('./../../user/UserActions');
var UserStore = require('./../../user/UserStore');

var USER = constants.USER;

let DirectoryView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    if(!_.isEmpty(this.props.activeBevy)) {
      this.search();
    }
    return {
      loadingInitial: (_.isEmpty(this.props.activeBevy)),
      query: '',
      searching: false,
      searchUsers: [],
      searchError: ''
    };
  },

  componentWillReceiveProps(nextProps) {
    if(!_.isEmpty(nextProps.activeBevy)) {
      this.setState({ loadingInitial: false });
      this.search();
    }
  },

  componentDidMount() {
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

  search() {
    let query = this.state.query;
    UserActions.search(query, this.props.activeBevy._id);
  },

  renderLoading() {

  },

  renderUsers() {
    let userItems = [];
    for(var key in this.state.searchUsers) {
      let user = this.state.searchUsers[key];
      userItems.push(
        <DirectoryItem
          key={ 'directoryitem:' + key }
          user={ user }
        />
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
        <h1 className='title'>Group Directory</h1>
        <Panel className='directory-panel'>
          <Input
            ref='search'
            type='text'
            value={ this.state.query }
            onChange={ this.onSearchChange }
            addonBefore={
              <i className='material-icons'>search</i>
            }
          />
          { this.renderUsers() }
        </Panel>
      </div>
    )
  }
});

let DirectoryItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },

  getInitialState() {
    return {

    };
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
      <div className='directory-item'>
        <div
          className='image'
          style={{ backgroundImage: 'url(' + profileImageURL + ')' }}
        />
        <div className='details'>

          <span className='email'>
            { this.renderBigName() }
            { this.renderSmallName() }
            { this.props.user.email }
            { this.renderTitle() }
          </span>
        </div>
      </div>
    );
  }
});

module.exports = DirectoryView;
