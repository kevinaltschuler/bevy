/**
 * InviteList.jsx
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var InviteListItem = require('./InviteListItem.jsx');

var _ = require('underscore');

var InviteList = React.createClass({
  propTypes: {
    userInvites: React.PropTypes.array
  },

  _renderUserInvites() {
    var inviteItems = [];
    for(var key in this.props.userInvites) {
      var userInvite = this.props.userInvites[key];
      inviteItems.push(
        <InviteListItem
          invite={ userInvite }
        />
      );
    }
    return inviteItems;
  },

  render() {
    var title = (!_.isEmpty(this.props.userInvites))
    ? <span>Pending Invites</span>
    : <div/>;

    return (
      <div className='invite-list'>
        {title }
        { this._renderUserInvites() }
      </div>
    );
  }
});

module.exports = InviteList;
