/**
 * ChatDropdown.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var {
  Button,
  Overlay
} = require('react-bootstrap');

var ThreadItem = require('./ThreadItem.jsx');

var constants = require('./../../constants');
var CHAT = constants.CHAT;
var ChatStore = require('./../ChatStore');
var ChatActions = require('./../ChatActions');

var user = window.bootstrap.user;
var email = user.email;

var ChatDropdown = React.createClass({

  propTypes: {
    show: React.PropTypes.bool,
    onToggle: React.PropTypes.func
  },

  getInitialState() {
    return {
      allThreads: []
    };
  },

  componentDidMount() {
    this.container = React.findDOMNode(this.refs.Container);
    ChatStore.on(CHAT.CHANGE_ALL, this.handleChangeAll);
  },

  componentWillUnmount() {
    ChatStore.off(CHAT.CHANGE_ALL, this.handleChangeAll);
  },

  handleChangeAll() {
    this.setState({
      allThreads: ChatStore.getAllThreads()
    });
  },

  toggle(ev) {
    ev.preventDefault();
    this.props.onToggle();
  },

  createMessage(ev) {
    ev.preventDefault();
    ChatActions.sendNewMessage();
    this.toggle(ev);
  },

  _renderThreadList() {
    var allThreads = this.state.allThreads;
    var threads = [];
    for(var key in allThreads) {
      var thread = allThreads[key];
      if(thread._id == -1) continue; // dont render new message panel/thread
      threads.push(
        <ThreadItem
          key={ 'chatdropdown:thread:' + thread._id }
          thread={ thread }
          onClick={ this.toggle }
        />
      );
    }

    return (
      <div className='thread-list'>
        { threads }
      </div>
    );
  },

  render() {
    return (
      <div ref='Container' style={{ position: 'relative' }}>
        <Button ref='ChatButton' className="chat-dropdown-btn" onClick={ this.toggle }>
          <div className='chat-img'/>
        </Button>
        <Overlay 
          show={ this.props.show }
          target={ (props) => React.findDOMNode(this.refs.ChatButton) }
          placement='bottom'
          container={ this.container }
        >
          <div className='chat-dropdown-container'>
            <div className='backdrop' onClick={ this.toggle }/>
            <div className='arrow' />
            <div className='chat-dropdown'>
              <div className='header'>
                <span className='inbox-text'>Inbox</span>
                <Button className='create-new-message-btn' onClick={ this.createMessage }>Send a New Message</Button>
              </div>
              { this._renderThreadList() }
              {/*
              <Button className='see-all-btn'>See all</Button>
              */}
            </div>
          </div>
        </Overlay>
      </div>
    );
  }
});

module.exports = ChatDropdown;
