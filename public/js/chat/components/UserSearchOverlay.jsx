/**
 * UserSearchOverlay.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var {
  Button,
  Overlay
} = require('react-bootstrap');

var UserActions = require('./../../profile/UserActions');
var UserStore = require('./../../profile/UserStore');
var constants = require('./../../constants');
var USER = constants.USER;

var noop = function() {};

var UserSearchOverlay = React.createClass({

  propTypes: {
    container: React.PropTypes.any, // the DOM node the overlay is rendered in
    target: React.PropTypes.func, // the DOM node the overlay is relative to
    query: React.PropTypes.string, // the search query entered in by the parent
    addUser: React.PropTypes.func, // callback thats called when a user is selected/added
    addedUsers: React.PropTypes.array // users that the overlay should exclude from search results
  },

  getDefaultProps() {
    return {
      addUser: noop,
      addedUsers: []
    };
  },

  getInitialState() {
    return {
      show: false,
      users: []
    }
  },

  componentDidMount() {
    UserStore.on(USER.SEARCHING, this.handleSearching);
    UserStore.on(USER.SEARCH_COMPLETE, this.handleSearchResults);
  },

  componentWillUnmount() {
    UserStore.off(USER.SEARCHING, this.handleSearching);
    UserStore.off(USER.SEARCH_COMPLETE, this.handleSearchResults);
  },

  handleSearching() {
    // TODO: loading indicator?
  },

  handleSearchResults() {
    var users = UserStore.getUserSearchResults();
    // dont show users that have already been added to the list
    users = _.reject(users, function($user) {
      var addedUsersIds = _.pluck(this.props.addedUsers, '_id');
      return _.contains(addedUsersIds, $user._id);
    }.bind(this));
    this.setState({
      users: users
    });
  },

  componentWillReceiveProps(nextProps) {
    if(_.isEmpty(nextProps.query)) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
      UserActions.search(nextProps.query);
    }
  },

  addUser(ev) {
    var key = ev.target.getAttribute('id');
    //console.log(key);
    this.props.addUser(this.state.users[key]);
  },

  render() {

    var users = [];
    for(var key in this.state.users) {
      var user = this.state.users[key];

      var image_url = (_.isEmpty(user.image_url)) ? '/img/user-profile-icon.png' : user.image_url;
      var name = user.displayName;
      var imageStyle = {
        backgroundImage: 'url(' + image_url + ')',
        backgroundSize: 'auto 100%',
        backgroundPosition: 'center'
      };

      users.push(
        <Button onClick={ this.addUser } key={ 'usersearchoverlay:user:' + user._id } id={ key } className='user-item'>
          <div className='image' id={ key } style={ imageStyle }/>
          <div className='details' id={ key }>
            <span className='name' id={ key }>{ name }</span>
          </div>
        </Button>
      );
    }

    return (
      <Overlay
        show={ this.state.show }
        target={ this.props.target }
        placement='bottom'
        container={ this.props.container }
      >
        <div className='user-search-overlay'>
          { users }
        </div>
      </Overlay>
    );
  }
});

module.exports = UserSearchOverlay;