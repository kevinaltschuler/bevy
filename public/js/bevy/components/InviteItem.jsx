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

	render() {
		var invite = this.props.invite;
		if(_.isEmpty(invite)) {
			return <div/>;
		}
		var user = invite.user;
		var image = user.image || { foreign: true, path: constants.defaultProfileImage };
		var actionButton = (invite.requestType == 'request_join')
		? <RaisedButton onClick={this.acceptRequest} label='accept'/>
		: <FlatButton onClick={this.cancelInvite} label='cancel'/>
		return (
			<div className='invite-item'>
				<div>
					<div className='user-img' style={{
						backgroundImage: 'url(' + resizeImage(image, 40, 40).url + ')'
					}}/>
					{user.displayName}
				</div>
				{actionButton}
			</div>
		);
	}
});

module.exports = InviteItem;
