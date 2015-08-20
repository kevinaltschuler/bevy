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

var noop = function() {
};

var UserSearchOverlay = React.createClass({

  propTypes: {
    container: React.PropTypes.any,
    target: React.PropTypes.func,
    query: React.PropTypes.string,
    addUser: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      addUser: noop
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

  },

  handleSearchResults() {
    this.setState({
      users: UserStore.getUserSearchResults()
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