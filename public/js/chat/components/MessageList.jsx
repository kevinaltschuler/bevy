'use strict';

var React = require('react');
var _ = require('underscore');

var MessageItem = require('./MessageItem.jsx');

var ChatActions = require('./../ChatActions');
var ChatStore = require('./../ChatStore');

var constants = require('./../../constants');
var CHAT = constants.CHAT;

var MessageList = React.createClass({

  propTypes: {
    thread: React.PropTypes.object,
    messages: React.PropTypes.array,
    bevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      loading: false
    };
  },

  componentDidMount() {
    ChatStore.on(CHAT.MESSAGE_FETCH + this.props.thread._id, this._onMessageFetch);
    var node = this.getDOMNode();
    node.scrollTop = node.scrollHeight;
  },

  componentWillUpdate() {
    var node = this.getDOMNode();
    this.shouldScrollBottom = ((node.scrollTop + node.offsetHeight) == node.scrollHeight);
  },

  componentDidUpdate() {
    var node = this.getDOMNode();

    if(this.prevScrollHeight < node.scrollHeight) {
      node.scrollTop = node.scrollHeight - this.prevScrollHeight - 20;
    }

    if(this.shouldScrollBottom) {
      node.scrollTop = node.scrollHeight;
    }
  },

  componentWillUnmount() {
    ChatStore.off(CHAT.MESSAGE_FETCH + this.props.thread._id, this._onMessageFetch);
  },

  _onMessageFetch() {
    this.setState({
      loading: false
    });
  },

  onScroll(ev) {
    var node = this.getDOMNode();
    if(node.scrollTop <= 0) {
      // load more
      this.setState({
        loading: true
      });
      this.prevScrollHeight = node.scrollHeight;

      ChatActions.loadMore(this.props.thread._id);
    }
  },

  render() {

    var allMessages = this.props.messages;
    var messages = [];

    // compress messages
    var threshold = 1000 * 60 * 3; // 3 minutes
    var $allMessages = [];
    var compressed = []; // keep track of comments that have been compressed already
    allMessages.forEach(function(message, index) {
      if(compressed.indexOf(message._id) > -1) return; // skip compressed
      var date = Date.parse(message.created);
      message.$body = ''; // clear the body between rerenders
      for(var i = index + 1; i < allMessages.length; i++) {
        var $message = allMessages[i];
        var $date = Date.parse($message.created);

        if($message.author._id != message.author._id) break; // dont compress posts by different authors
        if(Math.abs(date - $date) <= threshold) { // if the messages are within the time threshold
          // compress the message
          if(_.isEmpty(message.$body))
            message.$body = message.body + '\n' + $message.body;
          else
            message.$body = message.$body + '\n' + $message.body;
          compressed.push($message._id);
        } else break;
      }
      if(_.isEmpty(message.$body)) message.$body = message.body;
      $allMessages.push(message);
    });

    for(var key in $allMessages) {
      var message = $allMessages[key];
      messages.push(
        <MessageItem
          key={ 'message:' + message._id }
          message={ message }
          bevy={ this.props.bevy }
        />
      );
    }

    var loading = (this.state.loading)
      ? <span>Loading...</span>
      : '';

    return (
      <div id='message-list' className='message-list' onScroll={ this.onScroll }>
        { loading }
        { messages }
      </div>
    );
  }
});

module.exports = MessageList;
