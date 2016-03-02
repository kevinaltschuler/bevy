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
var Ink = require('react-ink');
var NotificationItem = require('./NotificationItem.jsx');

var _ = require('underscore');
var NotificationActions = require('./../NotificationActions');
var user = window.bootstrap.user;
var email = user.email;

var NotificationDropdown = React.createClass({
  propTypes: {
    allNotifications: React.PropTypes.array
  },

  getInitialState() {
    return {
      show: false
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
    //this.props.onToggle();
    this.setState({ show: !this.state.show });
    for(var key in this.props.allNotifications) {
      var notification = this.props.allNotifications[key];
      if(!notification.read) {
        NotificationActions.read(notification._id);
      }
    }
  },

  hide() {
    this.setState({ show: false });
  },

  renderNotificationList() {
    if(this.props.allNotifications.length < 1) {
      return (
        <span className='no-notifications'>All Caught Up!</span>
      );
    }

    var notifications = [];
    for(var key in this.props.allNotifications) {
      var notification = this.props.allNotifications[key];
      var id = notification._id || Date.now();
      var event = notification.event;
      var data = notification.data;
      var read = notification.read;

      notifications.push(
        <NotificationItem
          key={ id }
          id={ id }
          event={ event }
          data={ data }
          read= { read }
          hideDropdown={ this.hide }
        />
      );
    }

    return (
      <div className='notification-list'>
        { notifications }
      </div>
    );
  },

  render() {
    return (
      <div ref='Container' style={{ position: 'relative' }}>
        <Button
          ref='NotificationButton'
          className="notification-dropdown-btn"
          onClick={ this.toggle }
          title='Notifications'
        >
          <i className='material-icons'>notifications</i>
        </Button>
        <Overlay
          show={ this.state.show }
          target={ props => ReactDOM.findDOMNode(this.refs.NotificationButton) }
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
              { this.renderNotificationList() }
            </div>
          </div>
        </Overlay>
      </div>
    );
  }
});

module.exports = NotificationDropdown;
