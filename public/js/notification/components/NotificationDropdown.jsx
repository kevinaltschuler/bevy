/**
 * NotificationDropdown.jsx
 * @author KEVIN
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var {
  Button,
  Popover,
  Overlay
} = require('react-bootstrap');
var NotificationList = require('./NotificationList.jsx');
var InviteList = require('./InviteList.jsx');

var _ = require('underscore');
var NotificationActions = require('./../NotificationActions');
var user = window.bootstrap.user;
var email = user.email;

var NotificationDropdown = React.createClass({
  propTypes: {
    allNotifications: React.PropTypes.array,
    userInvites: React.PropTypes.array,
    show: React.PropTypes.bool,
    onToggle: React.PropTypes.func
  },

  getInitialState() {
    return {
    };
  },

  componentDidMount() {
    this.container = ReactDOM.findDOMNode(this.refs.Container);
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
    this.props.onToggle();
    for(var key in this.props.allNotifications) {
      var notification = this.props.allNotifications[key];
      NotificationActions.read(notification._id);
    }
  },

  renderOverlay() {
  },

  render() {
    return (
      <div ref='Container' style={{ position: 'relative' }}>
        <Button ref='NotificationButton' className="notification-dropdown-btn" onClick={ this.toggle } title='Notifications'>
          <div className='notification-img'/>
        </Button>
        <Overlay
          show={ this.props.show }
          target={ (props) => ReactDOM.findDOMNode(this.refs.NotificationButton) }
          placement='bottom'
          container={ this.container }
        >
          <div className='notification-dropdown-container'>
            <div className='backdrop' onClick={ this.toggle }/>
            <div className='arrow' />
            <div className='notification-dropdown'>
              <div className="title">
                <span className='title-text'>Notifications</span>
              </div>
              <NotificationList
                allNotifications={ this.props.allNotifications }
              />
              <InviteList
                userInvites={ this.props.userInvites }
              />
            </div>
          </div>
        </Overlay>
      </div>
    );
  }
});

module.exports = NotificationDropdown;
