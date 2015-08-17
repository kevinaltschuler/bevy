'use strict';

var React = require('react');
var _ = require('underscore');

var ChatPanel = require('./ChatPanel.jsx');

var constants = require('./../../constants');

var ChatDock = React.createClass({

  propTypes: {
    openThreads: React.PropTypes.array
  },

  getInitialState() {
    return {};
  },

  render() {
    var threads = [];
    var openThreads = (_.isEmpty(this.props.openThreads)) ? [] : this.props.openThreads;
    for(var key in openThreads) {
      var thread = openThreads[key];
      threads.push(
        <ChatPanel
          key={ 'panel' + thread._id }
          thread={ thread }
        />
      );
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
