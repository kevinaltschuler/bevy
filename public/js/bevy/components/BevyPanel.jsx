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
var Input = rbs.Input;
var ModalTrigger = rbs.ModalTrigger;

var mui = require('material-ui');
var DropDownMenu = mui.DropDownMenu;

var InviteModal = require('./InviteModal.jsx');
var MemberModal = require('./MemberModal.jsx');

var BevyActions = require('./../BevyActions');

var NotificationHeader;

var user = window.bootstrap.user;

var BevyPanel = React.createClass({

	propTypes: {
		  activeBevy: React.PropTypes.object
		, activeAlias: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			isEditing: false
		};
	},

	startEditing: function(ev) {
		//console.log('start editing');
		this.setState({
			isEditing: true
		});
	},

	stopEditing: function(ev) {
		var bevy_id = this.props.activeBevy.id;
		var name = this.refs.name.getValue();
		var description = this.refs.description.getValue();

		BevyActions.update(bevy_id, name, description);

		this.setState({
			isEditing: false
		});
	},

	leave: function(ev) {
		ev.preventDefault();

		if(!window.confirm('Are you sure?')) return;

		if(!this.props.activeBevy) return;

		var bevy_id = this.props.activeBevy.id;
		var email = user.email;
		var alias_id = this.props.activeAlias.id;

		BevyActions.leave(bevy_id, email, alias_id);
	},

	destroy: function(ev) {
		ev.preventDefault();

		if(!window.confirm('Are you sure?')) return;

		if(!this.props.activeBevy) return;

		var id = this.props.activeBevy.id;

		BevyActions.destroy(id);
	},

	render: function() {

		var bevy = this.props.activeBevy;
		var alias = this.props.activeAlias;

		var defaultBevyImage = '/img/logo_100.png';
		var bevyImage = "/"
		var name = (_.isEmpty(bevy)) ? 'not in a bevy' : bevy.get('name');
		var description = (_.isEmpty(bevy)) ? 'no description' : bevy.get('description');
		if(_.isEmpty(description)) description = 'no description';

		var notificationMenuItems = [
		   { payload: '1', text: 'All Posts' },
		   { payload: '2', text: 'My Posts' },
		   { payload: '3', text: 'Never' },
		];

		var members = (_.isEmpty(bevy)) ? [] : bevy.get('members');

		// check if current alias is member of bevy
		// if not, then add them to the member list
		var isMember = false;
		for(var key in members) {
			var member = members[key];
			if(member.aliasid) {
				if(member.aliasid._id == alias.id) {
					isMember = true;
				}
			}
		}
		if(!isMember
			&& !_.isEmpty(bevy)
			&& !_.isEmpty(alias)) {

			// add member
			BevyActions.addUser(bevy.id, alias.toJSON(), user.email);
		}

		var header;
		if(this.state.isEditing) {
			header = <div>
							<div className="row sidebar-top">
								<div className="col-xs-3 sidebar-picture">
									<img src={ defaultBevyImage }/>
								</div>
								<div className="col-xs-9 sidebar-title">
									<Input
										type='text'
										ref='name'
										defaultValue={ bevy.get('name') }
										placeholder='Group Name'
									/>
									<Input
										type='text'
										ref='description'
										defaultValue={ bevy.get('description') }
										placeholder='Group Description'
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col-xs-12'>
									<Button
										onClick={ this.stopEditing }
									>
										Save
									</Button>
								</div>
							</div>
						</div>;

		} else {
			header = <div className="row sidebar-top">
							<div className="col-xs-3 sidebar-picture">
								<img src={ defaultBevyImage }/>
							</div>
							<div className="col-xs-9 sidebar-title">
								<span
									className='sidebar-title-name'
									onDoubleClick={ this.startEditing }
								>
									{ name }
								</span>
								<span
									className='sidebar-title-description'
									onDoubleClick={ this.startEditing }
								>
									{ description }
								</span>
							</div>
						</div>;
		}


		return	<ButtonGroup className="col-sm-3 hidden-xs btn-group right-sidebar panel">

						{ header }

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
									<MemberModal
										activeBevy={ this.props.activeBevy }
										contacts={ members }
										title={ "Members of " + name } />
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
