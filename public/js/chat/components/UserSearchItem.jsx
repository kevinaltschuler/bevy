/**
 * UserSearchItem.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var Ink = require('react-ink');
var {
  Button
} = require('react-bootstrap');

var _ = require('underscore');
var constants = require('./../../constants');
var ChatActions = require('./../ChatActions');

var UserSearchItem = React.createClass({
  propTypes: {
    searchUser: React.PropTypes.object
  },

  getInitialState() {
    return {
    };
  },

  openUserThread(ev) {
    ev.preventDefault();
    ChatActions.startPM(this.props.searchUser._id);
  },

  render() {
    var user = this.props.searchUser;

    var image_url = (_.isEmpty(user.image)) 
      ? '/img/user-profile-icon.png' 
      : user.image.filename;
    var name = user.displayName;
    var imageStyle = {
      backgroundImage: 'url(' + image_url + ')',
      backgroundSize: 'auto 100%',
      backgroundPosition: 'center'
    };

    return (
      <Button 
        className='user-search-item' 
        style={{
          width: constants.chatSidebarWidthOpen
        }}
        onClick={ this.openUserThread }
      >
        <div className='image' style={ imageStyle }/>
        <div className='details'>
          <span className='name'>
            { name }
          </span>
        </div>
        <Ink style={{ 
          color: '#aaa', 
          height: 50, 
          top: 'inherit', 
          marginTop: '-5px' }}
        />
      </Button>
    );
  }
});

module.exports = UserSearchItem;