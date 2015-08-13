/**
 * ChatDropdown.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Button = rbs.Button;
var Popover = rbs.Popover;

var ConversationList = require('./../../chat/components/ConversationList.jsx');

var user = window.bootstrap.user;
var email = user.email;

var ChatDropdown = React.createClass({

  propTypes: {
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object
  },

  getInitialState() {
    return {
      isOverlayOpen: false,
    };
  },

  handleToggle(ev) {
    ev.preventDefault();
    this.setState({
      isOverlayOpen: !this.state.isOverlayOpen
    });
  },

  renderOverlay() {
    if(!this.state.isOverlayOpen) return <span />

    return (
      <div>
        <div className='chat-backdrop' onClick={ this.handleToggle } />
        <Popover className="chat-dropdown" placement='bottom'>
          <div className='top'>
            <div className='text'>chat</div>
            <div className='actions'>
              <span className='glyphicon glyphicon-plus'/>
            </div>
          </div>
          <ConversationList allThreads={ this.props.allThreads } />
        </Popover>
      </div>
    );
  },

  render() {
    return (
      <div>
        <Button className="chat-dropdown-btn" onClick={ this.handleToggle }>
          <div className='chat-img'/>
        </Button>
        { this.renderOverlay() }
      </div>
    );
  }
});

module.exports = ChatDropdown;
