/**
 * InviteUsersModal.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var {
  Modal,
  OverlayTrigger,
  Popover
} = require('react-bootstrap');
var {
  FlatButton,
  RaisedButton,
  Toggle,
  DropDownMenu,
  IconButton,
  TextField,
  Styles,
  CircularProgress
} = require('material-ui');

var ThemeManager = new Styles.ThemeManager();

var _ = require('underscore');
var BevyActions = require('./../BevyActions');
var BevyStore = require('./../BevyStore');
var InviteSearchItem = require('./InviteSearchItem.jsx');
var UserActions = require('./../../profile/UserActions');
var UserStore = require('./../../profile/UserStore');
var InviteItem = require('./InviteItem.jsx');
var constants = require('./../../constants');
var USER = constants.USER;
var BEVY = constants.BEVY;

var InviteUsersModal = React.createClass({

  propTypes: {
    activeBevy: React.PropTypes.object,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getInitialState() {
    return {
      invites: BevyStore.getInvites(),
      searchUsers: [],
      query: '',
      searching: false
    };
  },

  getInvites() {
    this.setState({
      invites: BevyStore.getInvites()
    })
  },

  componentDidMount() {
    UserStore.on(USER.SEARCH_COMPLETE, this.handleSearchResults);
    UserStore.on(USER.SEARCHING, this.handleSearching);
    BevyStore.on(BEVY.CHANGE_ALL, this.getInvites);
  },

  componentWillUnmount() {
    UserStore.off(USER.SEARCH_COMPLETE, this.handleSearchResults);
    UserStore.off(USER.SEARCHING, this.handleSearching);
    BevyStore.off(BEVY.CHANGE_ALL, this.getInvites);
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

  getChildContext() { 
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  componentWillMount() {
    ThemeManager.setComponentThemes({
      textField: {
        textColor: '#666',
        focusColor: '#666'
      },
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
      this.closeSearch();
      return;
    }
    this.setState({
      query: query,
      searching: true
    });
    if(_.isEmpty(query)) {
      this.closeSearch();
     return;
   }
    else { 
      this.openSearch();
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

  openSearch() {
    this.setState({ searchHeight: 250 });
  },

  closeSearch() {
    this.setState({ searchHeight: 0 });
  },

  _renderPendingInvites() {
    var allInvites = this.state.invites;
    var pendingInvites = [];

    for(var key in allInvites) {
      var invite = allInvites[key];
      var inviteItem = <InviteItem key={'inviteitem:' + key} invite={invite}/>;
      if(invite.requestType == 'invite') {
        pendingInvites.push(inviteItem);
      }
    } 

    if(pendingInvites.length == 0) {
      pendingInvites = <div style={{alignSelf: 'center', color: '#aaa'}}>empty</div>
    }

    return (          
      <div className='section'>
        <div className='section-title'>
          Pending Invites
        </div>
        {pendingInvites}
      </div>
    );
  },

  _renderPendingRequests() {
    var allInvites = this.state.invites;
    var pendingRequests = [];

    for(var key in allInvites) {
      var invite = allInvites[key];
      var inviteItem = <InviteItem key={'inviteitem: ' + key} invite={invite}/>;
      if(invite.requestType == 'request_join') {
        pendingRequests.push(inviteItem);
      }
    } 

    if(pendingRequests.length == 0) {
      pendingRequests = <div style={{alignSelf: 'center', color: '#aaa'}}>empty</div>
    }

    return (          
      <div className='section'>
        <div className='section-title'>
          Pending Requests
        </div>
        {pendingRequests}
      </div>
    );
  },

  render() {

    var searchResults = [];
    var userSearchResults = this.state.searchUsers;
    for(var key in userSearchResults) {

      var user = userSearchResults[key];
      
      searchResults.push(
        <InviteSearchItem
          key={ 'usersearch:' + user._id }
          user={ user }
          bevy={ this.props.activeBevy }
        />
      );
    }

    if(_.isEmpty(searchResults) && !_.isEmpty(this.state.query) && !this.state.searching) {
      searchResults = (
        <span style={{ alignSelf: 'center'}} className='no-results'>
          no results :(
        </span>
      );
    }

    if(this.state.searching) {
      searchResults = <div style={{alignSelf: 'center'}} className='loading-indeterminate'><CircularProgress mode="indeterminate" /></div>
    }

    var searchTitle = (this.state.searchHeight > 0)
    ? (<div className='section-title'>
        Search Results
      </div>)
    : <div/>;

    var bevy = this.props.activeBevy;

    return (
      <Modal className="bevy-invite-modal" show={ this.props.show } width='400px' onHide={ this.props.onHide } >
        <Modal.Header closeButton>
          <Modal.Title>
            Add users to <b>{this.props.activeBevy.name}</b>
            <div style={{height: 10}}/>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          { this._renderPendingRequests() }
          { this._renderPendingInvites() }
          <div className='search-section' style={{height: this.state.searchHeight, borderColor: (this.state.searchHeight > 0)?'rgb(224,224,224)': 'rgba(0,0,0,0)'}}>
            <div className='absolute-child' style={{maxHeight: this.state.searchHeight}}>
              { searchTitle }
              { searchResults }
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div style={{display: 'flex', flexDirection: 'row', marginTop: -15}}>  
            <IconButton
              iconClassName='glyphicon glyphicon-search'
              style={{ width: '20px', height: '20px', padding: '5px', marginTop: '15px', marginLeft: -10, marginRight: 10 }}
              iconStyle={{ color: '#666', fontSize: '14px' }}
              title='Search'
            />      
            <TextField
              style={{width: '230px'}}
              type='text'
              className='search-input'
              ref='userSearch'
              value={ this.state.query }
              onChange={ this.onChange }
              hintText='Search Users'
            />
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
});

InviteUsersModal.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = InviteUsersModal;
