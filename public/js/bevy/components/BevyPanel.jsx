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

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var ButtonGroup = rbs.ButtonGroup;
var MenuItem = rbs.MenuItem;
var Accordion = rbs.Accordion;
var Panel = rbs.Panel;
var Button = rbs.Button;
var ModalTrigger = rbs.ModalTrigger;

var mui = require('material-ui');
var DropDownMenu = mui.DropDownMenu;

var InviteModal = require('./InviteModal.jsx');
var ContactsModal = require('./../../profile/components/ContactsModal');

var BevyActions = require('./../BevyActions');

var NotificationHeader;

var user = window.bootstrap.user;

var BevyPanel = React.createClass({

	propTypes: {
		  activeBevy: React.PropTypes.object
		, activeAlias: React.PropTypes.object
	},

	getInitialState: function() {
		return <div>
				 </div>
	},

	leave: function(ev) {
		ev.preventDefault();

		if(!this.props.activeBevy) return;

		var id = this.props.activeBevy.id;

		BevyActions.leave(id);
	},

	destroy: function(ev) {
		ev.preventDefault();

		if(!window.confirm('Are you sure?')) return;

		if(!this.props.activeBevy) return;

		var id = this.props.activeBevy.id;

		BevyActions.destroy(id);
	},

	render: function() {

		var defaultBevyImage = '/img/logo_100.png';
		var bevyImage = "/"
		var bevyName = (_.isEmpty(this.props.activeBevy)) ? 'not in a bevy' : this.props.activeBevy.get('name');
		var notificationMenuItems = [
		   { payload: '1', text: 'All Posts' },
		   { payload: '2', text: 'My Posts' },
		   { payload: '3', text: 'Never' },
		];

		var bevy = this.props.activeBevy;
		//console.log(bevy);
		var members = (_.isEmpty(bevy)) ? [] : bevy.get('members');
		//var members = [];

		// check if current alias is member of bevy
		// if not, then add them to the member list
		//console.log(this.props.activeAlias);
		var isMember = false;
		for(var key in members) {
			var member = members[key];
			if(member.aliasid == this.props.activeAlias.id) {
				isMember = true;
			}
		}
		if(!isMember
			&& !_.isEmpty(this.props.activeBevy)
			&& !_.isEmpty(this.props.activeAlias)) {

			// add member
			BevyActions.addUser(this.props.activeBevy.id, this.props.activeAlias.id, user.email);
		}


		return	<ButtonGroup className="col-sm-3 hidden-xs btn-group right-sidebar panel">
						<div className="row sidebar-top">
							<div className="col-xs-3 sidebar-picture">
								<img src={ defaultBevyImage }/>
							</div>
							<div className="col-xs-9 sidebar-title">
								<span className='sidebar-title-name'>{ bevyName }</span>
								<span className='sidebar-title-description'>The Frontpage</span>
							</div>
						</div>

						<div className='row sidebar-links'>
							<ButtonGroup className="col-xs-12" role="group">
								<ModalTrigger modal={
									<InviteModal
										activeBevy={ this.props.activeBevy }
										activeAlias={ this.props.activeAlias }/>
								}>
									<Button type='button' className="sidebar-link">
										Invite People
									</Button>
								</ModalTrigger>
								•
								<ModalTrigger modal={
									<ContactsModal
										activeBevy={ this.props.activeBevy }
										title={ "Members of " + bevyName } />
								}>
								<Button type='button' className="sidebar-link">
									{ members.length + ' Members' }
								</Button>
								</ModalTrigger>
							</ButtonGroup>
						</div>

						<div className='row sidebar-action'>
							<div className="sidebar-action-title col-xs-12"> Currently Viewing </div>
							<Button type='button' className="sidebar-action-link">
								Nobody
							</Button>
						</div>
						<div className='row sidebar-action'>
							<div className="sidebar-action-title col-xs-12"> Notifications </div>
							<DropDownMenu className='sidebar-action-dropdown' menuItems={notificationMenuItems} />
						</div>

						<div className='row sidebar-bottom'>
							<div className='col-xs-6'>
								<Button className="sidebar-action-link-bottom"
									onClick={ this.leave }>
									Leave Bevy
								</Button>
							</div>
							<div className='col-xs-6'>
								<Button className="sidebar-action-link-bottom"
									onClick={ this.destroy }>
									Delete Bevy
								</Button>
							</div>
						</div>


					</ButtonGroup>
	}
});
module.exports = BevyPanel;
