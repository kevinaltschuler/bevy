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
    show: React.PropTypes.bool,
    onToggle: React.PropTypes.func
  },

  getInitialState() {
    return {
    };
  },

  componentDidMount() {
    this.container = React.findDOMNode(this.refs.Container);
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
          show={ this.props.show }
          target={ (props) => React.findDOMNode(this.refs.NotificationButton) }
          placement='bottom'
          container={ this.container }
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
