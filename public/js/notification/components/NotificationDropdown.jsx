/**
 * NotificationDropdown.jsx
 *
 * @author KEVIN
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Button = rbs.Button;
var Popover = rbs.Popover;

var NotificationList = require('./NotificationList.jsx');
var NotificationActions = require('./../NotificationActions');

var user = window.bootstrap.user;
var email = user.email;

var NotificationDropdown = React.createClass({

  //mixins: [OverlayMixin],

  propTypes: {
    allNotifications: React.PropTypes.array,
  },

  getInitialState() {
    return {
      isOverlayOpen: false
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

  handleToggle(ev) {
    ev.preventDefault();
    this.setState({
      isOverlayOpen: !this.state.isOverlayOpen
    });
  },

  renderOverlay() {
    if(!this.state.isOverlayOpen) return <span />

    var notifications = this.props.allNotifications;

    return (
      <div>
        <div className='notification-backdrop' onClick={ this.handleToggle } />
        <Popover className="notification-dropdown" placement='bottom'>
          <div className="title">
            <span className='title-text'>Notifications</span>
            {/*<IconButton iconClassName="glyphicon glyphicon-minus" tooltip='clear all' onClick={this.dismissAll}/>*/}
            <Button className='title-clear-all' onClick={ this.dismissAll }>Clear All</Button>
          </div>
          <NotificationList
            allNotifications={ notifications }
          />
        </Popover>
      </div>
    );
  },

  render() {
    return (
      <div>
        <Button className="notification-dropdown-btn" onClick={ this.handleToggle }>
          <div className='notification-img'/>
        </Button>
        { this.renderOverlay() }
      </div>
    );
  }
});

module.exports = NotificationDropdown;
