/**
 * ThreadItem.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var Ink = require('react-ink');

var {
  Button
} = require('react-bootstrap');

var constants = require('./../../constants');
var ChatActions = require('./../ChatActions');
var ChatStore = require('./../ChatStore');

var ThreadImage = require('./ThreadImage.jsx');

var user = window.bootstrap.user;

var noop = function() {};

var ThreadItem = React.createClass({

  propTypes: {
    thread: React.PropTypes.object.isRequired,
    width: React.PropTypes.any,
    onClick: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      width: '100%',
      onClick: noop
    }
  },

  openThread(ev) {
    ev.preventDefault();
    ChatActions.openThread(this.props.thread._id);
    this.props.onClick(ev);
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
    var name = ChatStore.getThreadName(thread._id);

    return (
      <Button 
        className='conversation-item'
        style={{ width: this.props.width }}
        onClick={ this.openThread }
      >
        <ThreadImage thread={ thread } />
        <div className='details'>
          <span className='name'>{ name }</span>
          <span className='latest-message'>{ this.getLatestMessage() }</span>
        </div>
        <Ink style={{ color: '#aaa', height: 50, top: 'inherit', marginTop: '-5px' }}/>
      </Button>
  );
  }
});

module.exports = ThreadItem;