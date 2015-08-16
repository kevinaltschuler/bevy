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

var ThreadItem = React.createClass({

  propTypes: {
    thread: React.PropTypes.object
  },

  openThread(ev) {
    ev.preventDefault();
    ChatActions.openThread(this.props.thread._id);
  },

  getLatestMessage() {
    var latestMessage = ChatStore.getLatestMessage(this.props.thread._id);
    var message = '';
    if(!_.isEmpty(latestMessage)) {
      var messageAuthor = latestMessage.author.displayName;
      if(latestMessage.author._id == user._id) messageAuthor = 'Me';
      message = (
        <span className='latest-message'>
          { messageAuthor + ': ' + latestMessage.body }
        </span>
      );
    }
    return message;
  },

  render() {

    var bevy = this.props.thread.bevy;
    var image_url = (bevy) ? bevy.image_url : '';
    if(_.isEmpty(image_url)) {
      if(bevy) image_url = '/img/logo_100.png';
      else image_url = '/img/user-profile-icon.png';
    }
    var imageStyle = {
      backgroundImage: 'url(' + image_url + ')',
      backgroundSize: 'auto 100%',
      backgroundPosition: 'center'
    };

    return (
      <Button 
        className='conversation-item'
        style={{ width: constants.chatSidebarWidthOpen }}
        onClick={ this.openThread }
      >
        <div className='image' style={imageStyle}/>
        <div className='conversation-details'>
          <span className='bevy-name'>{ bevy.name }</span>
          { this.getLatestMessage() }
        </div>
      </Button>
  );
  }
});

module.exports = ThreadItem;