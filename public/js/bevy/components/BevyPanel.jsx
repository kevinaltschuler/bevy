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
var BevyPanelHeader = require('./BevyPanelHeader.jsx');

var BevyActions = require('./../BevyActions');

var Uploader = require('./../../shared/components/Uploader.jsx');

var NotificationHeader;

var user = window.bootstrap.user;

var BevyPanel = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object,
		activeMember: React.PropTypes.object,
		myBevies: React.PropTypes.array.isRequired
	},

	getInitialState: function() {

		var activeBevy = this.props.activeBevy;
		var member = this.props.activeMember;
		var joined = _.findWhere(this.props.myBevies, { _id: activeBevy._id }) != undefined;

		return {
			name: activeBevy.name || '',
			description: activeBevy.description || '',
			image_url: activeBevy.image_url || '',
			isEditing: false,
			isEditingName: false,
			joined: joined
		};
	},

	componentWillReceiveProps: function(nextProps) {
		var bevy = nextProps.activeBevy;

		this.setState({
			name: bevy.name,
			description: bevy.description,
			image_url: bevy.image_url,
		});
	},

	findMember: function(user_id) {
		var members = this.props.activeBevy.members;
		return _.find(members, function(member) {
			if(_.isEmpty(member.user)) return false;
			if(member.user._id == user_id) return true;
			else return false;
		});
	},

	startEditingName: function(ev) {
		this.setState({
			isEditingName: true
		})
	},

	stopEditingName: function(ev) {

		var bevy_id = this.props.activeBevy.id;
		var user_id = window.bootstrap.user._id;
		var displayName = this.refs.displayName.getValue();
		var notificationLevel = this.state.activeMember.notificationLevel;
		var role = this.state.activeMember.role;
		var image_url = this.state.activeMember.image_url;

		BevyActions.editMember(bevy_id, user_id, displayName, notificationLevel, role, image_url);

		// update locally
		var activeMember = this.state.activeMember;
		activeMember.displayName = displayName;
		this.setState({
			isEditingName: false,
			displayName: displayName
		});
	},

	onAliasUploadComplete: function(file) {
		var filename = file.filename;
		var image_url = constants.apiurl + '/files/' + filename;
		image_url += '?w=75&h=75';
		this.setState({
			image_url: image_url
		});

		var bevy_id = this.props.activeBevy.id;

		var activeMember = this.state.activeMember;

		var role = activeMember.role;
		var displayName = activeMember.displayName;
		var notificationLevel = activeMember.notificationLevel;

		BevyActions.editMember(bevy_id, user._id, displayName, notificationLevel, role, image_url);
	},

	onChange: function(ev) {
		this.setState({
			name: this.refs.name.getValue(),
			description: this.refs.description.getValue()
		});
	},

	setNotificationLevel: function(ev, selectedIndex, menuItem) {
		ev.preventDefault();

		var activeMember = this.state.activeMember;

		var role = activeMember.role;
		var displayName = activeMember.displayName;
		var image_url = activeMember.image_url;

		var bevy_id = this.props.activeBevy.id;
		var user = window.bootstrap.user;
		var notificationLevel = menuItem.payload;

		BevyActions.editMember(bevy_id, user._id, displayName, notificationLevel, role, image_url);

		// now update locally
		activeMember.notificationLevel = notificationLevel;
		this.setState({
			activeMember: activeMember
		});
	},

	onRequestJoin: function(ev) {
		ev.preventDefault();

		BevyActions.join(this.props.activeBevy._id, window.bootstrap.user._id, window.bootstrap.user.email);

		var bevy = this.props.bevy;
		var joined = true;

		this.setState({
			joined: joined
		});
	},

	onRequestLeave: function(ev) {
		ev.preventDefault();

		BevyActions.leave(this.props.activeBevy._id);

		var bevy = this.props.bevy;
		var joined = false;

		this.setState({
			joined: joined
		});
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
		var bevyImage = (_.isEmpty(this.state.image_url)) ? '/img/logo_100.png' : this.state.image_url;
		var bevyImageStyle = (this.state.image_url === '/img/logo_100.png')
		? {
			backgroundImage: 'url(' + bevyImage + ')'

		}
		: {
			backgroundImage: 'url(' + bevyImage + ')'
		};

		/*var aliasImage = (this.state.activeMember.image_url)
		? this.state.activeMember.image_url
		: '/img/logo_100.png';

		var aliasImageStyle = {
			backgroundImage: 'url(' + aliasImage + ')'
		};*/

		var imgStyle = (this.state.image_url === '/img/logo_100.png')
		? { minWidth: '50px', height: 'auto' }
		: { minWidth: '100px', height: 'auto' };

		var name = (_.isEmpty(bevy)) ? 'not in a bevy' : this.state.name;
		var description = (_.isEmpty(bevy)) ? 'no description' : this.state.description;
		if(_.isEmpty(description)) description = 'no description';

		var notificationMenuItems = [
		   { payload: 'all', text: 'All Posts', defaultIndex: 0 },
		   { payload: 'my', text: 'My Posts', defaultIndex: 1 },
		   { payload: 'never', text: 'Never', defaultIndex: 2 },
		];

		var members = (_.isEmpty(bevy)) ? [] : bevy.members;

		//var member = this.state.activeMember
		var itemIndex = 0;
		/*if(!_.isEmpty(member)) {
			var level = member.notificationLevel;

			// swap so the level from the db is the selected one
			var item = _.findWhere(notificationMenuItems, { payload: level });
			itemIndex = item.defaultIndex;
		}*/

		var aliasDropzoneOptions = {
			maxFiles: 1,
			acceptedFiles: 'image/*',
			clickable: '.dropzone-panel-button',
			dictDefaultMessage: ' ',
		};

		/*var nameEditAction = (this.state.isEditingName)
		? (
			<div className='sidebar-action name-edit-action'>
				<div className="sidebar-action-title"> Posting As... </div>
				<div className='sidebar-action-deets'>
					<Uploader
						onUploadComplete={ this.onAliasUploadComplete }
						className="alias-image-dropzone"
						style={ aliasImageStyle }
						dropzoneOptions={ aliasDropzoneOptions }
					/>
					<TextField
							type='text'
							ref='displayName'
							defaultValue={ this.state.displayName }
					/>
					<IconButton
						className="save-button"
						tooltip='save'
						onClick={ this.stopEditingName }>
						<span className="glyphicon glyphicon-ok"></span>
					</IconButton>
				</div>
			</div>
		)
		: (
			<div className='sidebar-action name-edit-action'>
				<div className="sidebar-action-title"> Posting As... </div>
				<div className='sidebar-action-deets'>
					<div className='alias-img' style={ aliasImageStyle }/>
					<span className='sidebar-posting-name'>
						{ this.state.displayName }
					</span>
					<IconButton
						className="edit-button"
						tooltip='edit name'
						onClick={ this.startEditingName }>
						<span className="glyphicon glyphicon-pencil"></span>
					</IconButton>
				</div>
			</div>
		);*/

		//if(!bevy.settings.anonymise_users) nameEditAction = '';

		/*if(this.state.activeMember) {
			var bottomActions = (this.state.activeMember.role == 'admin')
			? (<div className='sidebar-bottom'>
					<div>
						<ModalTrigger modal={<BevySettingsModal activeBevy={this.props.activeBevy} />}>
							<Button className="sidebar-action-link-bottom">
								Bevy Settings
							</Button>
						</ModalTrigger>
					</div>
					<div>
							<Button className="sidebar-action-link-bottom"
								onClick={ this.destroy }>
								Delete Bevy
							</Button>
					</div>
				</div>)
			: (<div className='sidebar-bottom'>
					<div>
						{/* user settings }
		/*			</div>
					<div>
						 <Button className="sidebar-action-link-bottom"
							onClick={ this.leave }>
							Leave Bevy
						  </Button>
					</div>
				</div>)
		}*/

		var _joinButton = (this.state.joined)
		? <RaisedButton label='leave' onClick={this.onRequestLeave} />
		: <RaisedButton label='join' onClick={this.onRequestJoin} /> 

		var joinButton = (_.isEmpty(window.bootstrap.user))
		? <div/>
		: _joinButton

		if(window.bootstrap.user) {
			var bottomActions = (_.find(bevy.admins, function(admin) { window.bootstrap.user._id == admin }))
			? (<div className='sidebar-bottom'>
					<div>
						<ModalTrigger modal={<BevySettingsModal activeBevy={this.props.activeBevy} />}>
							<RaisedButton label='Settings' />
						</ModalTrigger>
					</div>
					<div>
						{ joinButton }
					</div>
				</div>)
			: (<div className='sidebar-bottom'>
					<div>
					</div>
					<div>
						{ joinButton }
					</div>
				</div>)
		}


		return (
			<div className="bevy-panel panel">
				<BevyPanelHeader {...this.props}/>
				{/*<div className='sidebar-links'>
					<ModalTrigger modal={ <InviteModal activeBevy={ this.props.activeBevy } />	}>
						<Button type='button' className="sidebar-link">
							Invite People
						</Button>
					</ModalTrigger>
					•
					<ModalTrigger modal={
						<MemberModal
							activeBevy={ this.props.activeBevy }
							activeMember={ this.props.activeMember }
							contacts={ members }
							title={ <span className='member-modal-title'>Members of <b>{ name }</b></span> }
						/>
					}>
						<Button type='button' className="sidebar-link">
							{ members.length + ' Members' }
						</Button>
					</ModalTrigger>
				</div>*/}

				{/* nameEditAction */}

				{/*<div className='sidebar-action'>
					<div className="sidebar-action-title"> Notifications </div>
					<DropDownMenu
						className='sidebar-action-dropdown'
						menuItems={ notificationMenuItems }
						onChange={ this.setNotificationLevel }
						selectedIndex={ itemIndex }
					/>
				</div>*/}

				{ bottomActions }

			</div>
		);
	}
});
module.exports = BevyPanel;
