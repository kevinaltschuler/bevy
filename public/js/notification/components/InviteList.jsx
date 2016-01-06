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
          key={'inviteitem:' + key}
          invite={ userInvite }
        />
      );
    }
    return inviteItems;
  },

  render() {
    if(_.isEmpty(this.props.userInvites)) return <div />;

    var title = (!_.isEmpty(this.props.userInvites))
    ? <div className='section-title'>Pending Invites</div>
    : <div/>;

    return (
      <div className='invite-list'>
        { title }
        { this._renderUserInvites() }
      </div>
    );
  }
});

module.exports = InviteList;
