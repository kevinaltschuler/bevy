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
var resizeImage = require('./../../shared/helpers/resizeImage');
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

	_renderActionButton() {
		return (this.props.invite.requestType == 'request_join')
		? (
			<RaisedButton
				onClick={ this.acceptRequest }
				label='accept'
				title='Accept Invite'
			/>
		) : (
			<FlatButton
				onClick={ this.cancelInvite }
				label='cancel'
				title='Cancel Invite'
			/>
		);
	},

	render() {
		var invite = this.props.invite;
		if(_.isEmpty(invite)) {
			return <div/>;
		}
		var user = invite.user;
		var image = user.image || { foreign: true, path: constants.defaultProfileImage };

		return (
			<div className='invite-item'>
				<div className='user-img' style={{
					backgroundImage: 'url(' + resizeImage(image, 64, 64).url + ')'
				}}/>
				<span className='name'>{ user.displayName }</span>
				{ this._renderActionButton() }
			</div>
		);
	}
});

module.exports = InviteItem;
