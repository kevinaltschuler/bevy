/**
 * ThreadItem.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var {
  Button
} = require('react-bootstrap');

var constants = require('./../../constants');
var ChatActions = require('./../ChatActions');
var ChatStore = require('./../ChatStore');

var user = window.bootstrap.user;

var ThreadItem = React.createClass({

  propTypes: {
    thread: React.PropTypes.object.isRequired,
    width: React.PropTypes.mixed
  },

  getDefaultProps() {
    return {
      width: '100%'
    }
  },

  openThread(ev) {
    ev.preventDefault();
    ChatActions.openThread(this.props.thread._id);
  },

  getLatestMessage() {
    var latestMessage = ChatStore.getLatestMessage(this.props.thread._id);
    if(!_.isEmpty(latestMessage)) {
      var messageAuthor = latestMessage.author.displayName;
      if(latestMessage.author._id == user._id) messageAuthor = 'Me';
    } else return '';
    return messageAuthor + ': ' + latestMessage.body;
  },

  render() {
    var thread = this.props.thread;
    var bevy = this.props.thread.bevy;
    var image_url = '/img/logo_100.png';
    var name = 'thread';
    switch(thread.type) {
      case 'pm':
        var otherUser = _.find(thread.users, function($user) {
          return $user._id != user._id;
        });

        name = otherUser.displayName;
        image_url = (_.isEmpty(otherUser.image_url)) ? '/img/user-profile-icon.png' : otherUser.image_url;
        break;
      case 'group':
        break;
      case 'bevy':
        name = bevy.name;
        image_url = (_.isEmpty(bevy.image_url)) ? image_url : bevy.image_url;
        break;
    }

    var imageStyle = {
      backgroundImage: 'url(' + image_url + ')',
      backgroundSize: 'auto 100%',
      backgroundPosition: 'center'
    };

    return (
      <Button 
        className='conversation-item'
        style={{ width: this.props.width }}
        onClick={ this.openThread }
      >
        <div className='image' style={ imageStyle }/>
        <div className='details'>
          <span className='name'>{ name }</span>
          <span className='latest-message'>{ this.getLatestMessage() }</span>
        </div>
      </Button>
  );
  }
});

module.exports = ThreadItem;