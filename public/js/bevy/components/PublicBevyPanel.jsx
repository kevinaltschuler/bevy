/**
 * BevyPanel.jsx
 * formerly RightSidebar.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var ButtonGroup = rbs.ButtonGroup;
var MenuItem = rbs.MenuItem;
var Accordion = rbs.Accordion;
var Panel = rbs.Panel;
var Button = rbs.Button;
var Input = rbs.Input;
var ModalTrigger = rbs.ModalTrigger;

var mui = require('material-ui');
var DropDownMenu = mui.DropDownMenu;
var IconButton = mui.IconButton;
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;

var InviteModal = require('./InviteModal.jsx');
var MemberModal = require('./MemberModal.jsx');
var BevySettingsModal = require('./BevySettingsModal.jsx');

var BevyActions = require('./../BevyActions');

var Uploader = require('./../../shared/components/Uploader.jsx');

var NotificationHeader;

var user = window.bootstrap.user;

var PublicBevyPanel = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object,
	},

	getInitialState: function() {

		var bevy = this.props.activeBevy;

		return {
			name: bevy.name || '',
			description: bevy.description || '',
			image_url: bevy.image_url || '',
		};
	},

	onRequestJoin: function(ev) {
		ev.preventDefault();

		BevyActions.requestJoin(this.props.activeBevy, window.bootstrap.user);
	},

	render: function() {

		var bevy = this.props.activeBevy;
		var bevyImage = (_.isEmpty(this.state.image_url)) ? '/img/logo_100.png' : this.state.image_url;
		var bevyImageStyle = (this.state.image_url === '/img/logo_100.png')
		? {
			backgroundImage: 'url(' + bevyImage + ')',
			backgroundSize: '100px auto',

		}
		: {
			backgroundImage: 'url(' + bevyImage + ')',
			backgroundSize: '50px 50px',
		}

		var bevyAdmin = (_.isEmpty(_.findWhere(bevy.members, {role: 'admin'})))
		? ''
		: _.findWhere(bevy.members, {role: 'admin'}).displayName

		var imgStyle = (this.state.image_url === '/img/logo_100.png')
		? { minWidth: '50px', height: 'auto' }
		: { minWidth: '100px', height: 'auto' };

		var name = (_.isEmpty(bevy)) ? 'not in a bevy' : this.state.name;
		var description = (_.isEmpty(bevy)) ? 'no description' : this.state.description;
		if(_.isEmpty(description)) description = 'no description';

		var header = (
			<div className="sidebar-top">
				<div className="sidebar-picture">
					<div className='profile-img' style={ bevyImageStyle }/>
				</div>
				<div className="sidebar-title">
					<div>
						<span className='sidebar-title-name'>
							{ name }
						</span>
					</div>
					<div>
						<span className='sidebar-title-description' >
							{ description }
						</span>
					</div>
				</div>
			</div>
		);

		return (
			<div className= "panel public-bevy-panel">
				<div className="right-sidebar btn-group">
					{ header }
					<div className='sidebar-links'>
						<ButtonGroup role="group">
							<span type='button' className="sidebar-link">
								12 Members
							</span>
							<span type='button' className="sidebar-link">
								Created by: {bevyAdmin}
							</span>
						</ButtonGroup>
					</div>

					<div className='sidebar-action'>
						<RaisedButton
							className='request-button'
							onClick={ this.onRequestJoin }
							label = {'Request Invite'}
						/>
					</div>

				 </div>
			</div>
		);
	}
});
module.exports = PublicBevyPanel;
