/* InviteItem.jsx
 * @author kevin
 */

'use strict';

var React = require('react');

var {
	Avatar,
	FlatButton,
	RaisedButton
} = require('material-ui');

var _ = require('underscore');
var constants = require('./../../constants');
var BevyActions = require('./../BevyActions');

var InviteItem = React.createClass({
	propTypes: {
		invite: React.PropTypes.object
	},

	cancelInvite() {
		var invite = this.props.invite;
		BevyActions.destroyInvite(invite._id);
	},

	acceptRequest() {
		var invite = this.props.invite;
		BevyActions.acceptRequest(invite._id);
	},

	render() {
		var invite = this.props.invite;
		if(_.isEmpty(invite)) {
			return <div/>;
		}
		var user = invite.user;
		var image = user.image || {path: constants.defaultProfileImage};
		var actionButton = (invite.requestType == 'request_join')
		? <RaisedButton onClick={this.acceptRequest} label='accept'/>
		: <FlatButton onClick={this.cancelInvite} label='cancel'/>
		return (
			<div className='invite-item'>
				<div>
					<Avatar size={40} src={image.path} />
					{user.displayName}
				</div>
				{actionButton}
			</div>
		);
	}
});

module.exports = InviteItem;