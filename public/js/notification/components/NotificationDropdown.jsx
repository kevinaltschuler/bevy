/**
 * NotificationDropdown.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var {
  Button,
  Popover,
  Overlay
} = require('react-bootstrap');

var NotificationList = require('./NotificationList.jsx');

var NotificationActions = require('./../NotificationActions');
var user = window.bootstrap.user;
var email = user.email;

var NotificationDropdown = React.createClass({
  propTypes: {
    allNotifications: React.PropTypes.array,
  },

  getInitialState() {
    return {
      show: false
    };
  },

  dismissAll(ev) {
    ev.preventDefault();
    var allNotifications = this.props.allNotifications;
    for(var key in allNotifications) {
      var notification = allNotifications[key];
      NotificationActions.dismiss(notification._id);
    }
  },

  toggle(ev) {
    ev.preventDefault();
    this.setState({
      show: !this.state.show
    });
  },

  renderOverlay() {
  },

  render() {
    return (
      <div ref='Container' style={{ position: 'relative' }}>
        <Button ref='NotificationButton' className="notification-dropdown-btn" onClick={ this.toggle }>
          <div className='notification-img'/>
        </Button>
        <Overlay
          show={ this.state.show }
          target={ (props) => React.findDOMNode(this.refs.NotificationButton) }
          placement='bottom'
          container={ React.findDOMNode(this.refs.Container) }
        >
          <div className='notification-dropdown-container'>
            <div className='backdrop' onClick={ this.toggle }/>
            <div className='arrow' />
            <div className='notification-dropdown'>
              <div className="title">
                <span className='title-text'>Notifications</span>
                <Button className='title-clear-all' onClick={ this.dismissAll }>Clear All</Button>
              </div>
              <NotificationList
                allNotifications={ this.props.allNotifications }
              />
            </div>
          </div>
        </Overlay>
      </div>
    );
  }
});

module.exports = NotificationDropdown;
