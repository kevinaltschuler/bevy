/**
 * NotificationList.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;

var NotificationItem = require('./NotificationItem.jsx');

var user = window.bootstrap.user;

var NotificationList = React.createClass({

  propTypes: {
    allNotifications: React.PropTypes.array,
  },

  render() {

    var allNotifications = this.props.allNotifications;

    if(allNotifications.length < 1) {
      return (
        <span>No Notifications!</span>
      );
    }

    var notifications = [];
    for(var key in allNotifications) {
      var notification = allNotifications[key];
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
        />
      );
    }

    return (
      <div>
        { notifications }
      </div>
    );
  }
});

module.exports = NotificationList;
