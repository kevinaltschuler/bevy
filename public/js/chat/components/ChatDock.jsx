/**
 * ChatDock.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var ChatPanel = require('./ChatPanel.jsx');
var NewThreadPanel = require('./NewThreadPanel.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var CHAT = constants.CHAT;
var ChatStore = require('./../ChatStore');

var ChatDock = React.createClass({

  getInitialState() {
    return {
      openThreads: []
    };
  },

  componentDidMount() {
    ChatStore.on(CHAT.CHANGE_ALL, this.handleChangeAll);
  },

  componentWillUnmount() {
    ChatStore.off(CHAT.CHANGE_ALL, this.handleChangeAll);
  },

  handleChangeAll() {
    this.setState({
      openThreads: ChatStore.getOpenThreads()
    });
  },

  render() {
    console.log(this.state.openThreads);
    var threads = [];
    var openThreads = this.state.openThreads;
    for(var key in openThreads) {
      var thread = openThreads[key];
      if(thread._id == -1) {
        // render the new message panel
        threads.push(
          <NewThreadPanel 
            key={ 'panel' + thread._id }
          />
        );
      } else {
        // render the normal chat panel
        threads.push(
          <ChatPanel
            key={ 'panel' + thread._id }
            thread={ thread }
          />
        );
      }
    }

    return (
      <div className='chat-dock' style={{
        marginRight: constants.chatSidebarWidthOpen
      }}>
        { threads }
      </div>
    );
  }
});

module.exports = ChatDock;
