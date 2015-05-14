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
var IconButton = mui.IconButton;

var InviteModal = require('./InviteModal.jsx');
var MemberModal = require('./MemberModal.jsx');

var BevyActions = require('./../BevyActions');

var NotificationHeader;

var user = window.bootstrap.user;

var BevyPanel = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			activeMember: null,
			isEditing: false
		};
	},

	componentWillReceiveProps: function(nextProps) {
		var bevy = nextProps.activeBevy;
		if(!_.isEmpty(bevy)) {
			var members = bevy.get('members');
			var member = _.find(members, function(m) {
				var user = window.bootstrap.user;
				return m.userid._id == user._id;
			});
			if(member) {
				this.setState({
					activeMember: member
				});
			} else {
				// add member
			}
		}
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

	onKeyUp: function(ev) {
		if(ev.which === 13) {
			this.stopEditing(ev);
		}
	},

	setNotificationLevel: function(ev, selectedIndex, menuItem) {
		ev.preventDefault();

		var bevy_id = this.props.activeBevy.id;
		var user = window.bootstrap.user;
		var level = menuItem.payload;

		BevyActions.setNotificationLevel(bevy_id, user._id, level);
	},

	leave: function(ev) {
		ev.preventDefault();

		if(!window.confirm('Are you sure?')) return;

		if(!this.props.activeBevy) return;

		var bevy_id = this.props.activeBevy.id;
		var email = user.email;
		var user = window.bootstrap.user;

		BevyActions.leave(bevy_id, email, user._id);
		// then switch to another bevy
		BevyActions.switch();
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

		var defaultBevyImage = '/img/logo_100.png';
		var bevyImage = "/"
		var name = (_.isEmpty(bevy)) ? 'not in a bevy' : bevy.get('name');
		var description = (_.isEmpty(bevy)) ? 'no description' : bevy.get('description');
		if(_.isEmpty(description)) description = 'no description';

		var notificationMenuItems = [
		   { payload: 'all', text: 'All Posts', defaultIndex: 0 },
		   { payload: 'my', text: 'My Posts', defaultIndex: 1 },
		   { payload: 'never', text: 'Never', defaultIndex: 2 },
		];

		var members = (_.isEmpty(bevy)) ? [] : bevy.get('members');

		var member = this.state.activeMember
		if(!_.isEmpty(member)) {
			var level = member.notificationLevel;

			// swap so the level from the db is the selected one
			var temp = _.findWhere(notificationMenuItems, { payload: level });
			var first = notificationMenuItems[0];

			notificationMenuItems[temp.defaultIndex] = first;
			notificationMenuItems[0] = temp;

		} else {

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
										onKeyUp={ this.onKeyUp }
									/>
									<Input
										type='text'
										ref='description'
										defaultValue={ bevy.get('description') }
										placeholder='Group Description'
										onKeyUp={ this.onKeyUp }
									/>
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
								<IconButton className="edit-button" tooltip='edit name' onClick={ this.startEditing }>
									<span className="glyphicon glyphicon-pencil btn"></span>
								</IconButton>
								<span
									className='sidebar-title-description'
									onDoubleClick={ this.startEditing }
								>
									{ description }
								</span>
							</div>
						</div>;
		}


		return <ButtonGroup className="btn-group right-sidebar panel">

					{ header }

					<div className='row sidebar-links'>
						<ButtonGroup className="col-xs-12" role="group">
							<ModalTrigger modal={
								<InviteModal
									activeBevy={ this.props.activeBevy }
								/>
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
						<div className="sidebar-action-title col-xs-12"> Notifications </div>
						<DropDownMenu
							className='sidebar-action-dropdown'
							menuItems={ notificationMenuItems }
							onChange={ this.setNotificationLevel }
						/>
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
