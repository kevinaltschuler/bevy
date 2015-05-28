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

var BevyPanel = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object,
		activeMember: React.PropTypes.object
	},

	getInitialState: function() {

		var bevy = this.props.activeBevy;
		var member = this.props.activeMember;

		return {
			name: bevy.name || '',
			description: bevy.description || '',
			image_url: bevy.image_url || '',
			displayName: member.displayName || 'no display name',
			activeMember: member || null,
			isEditing: false,
			isEditingName: false,
		};
	},

	componentWillReceiveProps: function(nextProps) {
		var bevy = nextProps.activeBevy;

		this.setState({
			name: bevy.name,
			description: bevy.description,
			image_url: bevy.image_url,
			activeMember: nextProps.activeMember,
			displayName: (nextProps.activeMember && nextProps.activeMember.displayName)
				? nextProps.activeMember.displayName
				: 'no display name'
		});
	},

	startEditing: function(ev) {
		this.setState({
			isEditing: true
		});
	},

	stopEditing: function(ev) {
		var bevy_id = this.props.activeBevy.id;
		var name = this.state.name;
		var description = this.state.description;
		var image_url = this.state.image_url;

		BevyActions.update(bevy_id, name, description, image_url);

		this.setState({
			isEditing: false
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

		BevyActions.editMember(bevy_id, user_id, displayName, notificationLevel, role);

		// update locally
		var activeMember = this.state.activeMember;
		activeMember.displayName = displayName;
		this.setState({
			isEditingName: false,
			displayName: displayName,
			activeMember: activeMember
		});
	},

	onUploadComplete: function(file) {
		var filename = file.filename;
		var image_url = constants.apiurl + '/files/' + filename;
		this.setState({
			image_url: image_url
		});

		var bevy_id = this.props.activeBevy.id;
		var name = this.state.name;
		var description = this.state.description;

		BevyActions.update(bevy_id, name, description, image_url);
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

		var bevy_id = this.props.activeBevy.id;
		var user = window.bootstrap.user;
		var notificationLevel = menuItem.payload;

		BevyActions.editMember(bevy_id, user._id, displayName, notificationLevel, role);

		// now update locally
		activeMember.notificationLevel = notificationLevel;
		this.setState({
			activeMember: activeMember
		});
	},

	leave: function(ev) {
		ev.preventDefault();

		if(!window.confirm('Are you sure?')) return;

		if(!this.props.activeBevy) return;

		var bevy_id = this.props.activeBevy.id;

		BevyActions.leave(bevy_id);
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
			backgroundImage: 'url(' + bevyImage + ')',
			backgroundSize: '100px auto',

		}
		: {
			backgroundImage: 'url(' + bevyImage + ')',
			backgroundSize: '50px 50px',
		}

		var imgStyle = (this.state.image_url === '/img/logo_100.png')
		? { minWidth: '50px', height: 'auto' }
		: { minWidth: '100px', height: 'auto' }

		var name = (_.isEmpty(bevy)) ? 'not in a bevy' : this.state.name;
		var description = (_.isEmpty(bevy)) ? 'no description' : this.state.description;
		if(_.isEmpty(description)) description = 'no description';

		var notificationMenuItems = [
		   { payload: 'all', text: 'All Posts', defaultIndex: 0 },
		   { payload: 'my', text: 'My Posts', defaultIndex: 1 },
		   { payload: 'never', text: 'Never', defaultIndex: 2 },
		];

		var members = (_.isEmpty(bevy)) ? [] : bevy.members;

		var member = this.state.activeMember
		var itemIndex = 0;
		if(!_.isEmpty(member)) {
			var level = member.notificationLevel;

			// swap so the level from the db is the selected one
			var item = _.findWhere(notificationMenuItems, { payload: level });
			itemIndex = item.defaultIndex;
		}

		var dropzoneOptions = {
			maxFiles: 1,
			acceptedFiles: 'image/*',
			clickable: '.dropzone-panel-button',
			dictDefaultMessage: ' ',
		};

		var editButton = '';
		if(this.state.activeMember) {
			editButton = (this.state.activeMember.role == 'admin')
			? (<IconButton
					className="edit-button"
					tooltip='edit name'
					onClick={ this.startEditing }>
					<span className="glyphicon glyphicon-pencil btn"></span>
				</IconButton>)
			: '';
		}

		var header = (this.state.isEditing)
		? (<div>
				<div className="row sidebar-top">
					<div className="col-xs-3 sidebar-picture">
						<Uploader
							onUploadComplete={ this.onUploadComplete }
							className="bevy-image-dropzone"
							style={ bevyImageStyle }
							dropzoneOptions={ dropzoneOptions }
						/>
					</div>
					<div className="col-xs-9 sidebar-title">
						<TextField
							type='text'
							ref='name'
							defaultValue={ name }
							value={ name }
							placeholder='Group Name'
							onKeyUp={ this.onKeyUp }
							onChange={ this.onChange }
						/>
						<TextField
							type='text'
							ref='description'
							defaultValue={ description }
							value={ description }
							placeholder='Group Description'
							onKeyUp={ this.onKeyUp }
							onChange={ this.onChange }
							multiLine= { true }
						/>
						<RaisedButton label="save changes" onClick= {this.stopEditing} />
					</div>
				</div>
			</div>)
		: (<div className="row sidebar-top">
				<div className="col-xs-3 sidebar-picture">
					<div className='profile-img' style={ bevyImageStyle }/>
				</div>
				<div className="col-xs-9 sidebar-title">
					<div className='row'>
						<span
							className='sidebar-title-name'
							onDoubleClick={ this.startEditing } >
							{ name }
						</span>
						{ editButton }
					</div>
					<div className='row'>
						<span
							className='sidebar-title-description'
							onDoubleClick={ this.startEditing } >
							{ description }
						</span>
					</div>
				</div>
			</div>
		);

		var nameEditAction = (this.state.isEditingName)
		? (<div className='row sidebar-action name-edit-action'>
				<div className="sidebar-action-title col-xs-12"> Posting As... </div>
				<TextField
						type='text'
						ref='displayName'
						defaultValue={ this.state.displayName }
				/>
				<IconButton
					className="save-button"
					tooltip='save changes'
					onClick={ this.stopEditingName }>
					<span className="glyphicon glyphicon-heart-empty"></span>
				</IconButton>
			</div>)
		: (<div className='row sidebar-action name-edit-action'>
				<div className="sidebar-action-title col-xs-12"> Posting As... </div>
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
		);
		console.log(bevy.settings);
		if(!bevy.settings.anonymise_users) nameEditAction = '';

		if(this.state.activeMember) {
			var bottomActions = (this.state.activeMember.role == 'admin')
			? (<div className='row sidebar-bottom'>
					<div className='col-xs-6'>
						<ModalTrigger modal={<BevySettingsModal activeBevy={this.props.activeBevy} />}>
							<Button className="sidebar-action-link-bottom">
								Bevy Settings
							</Button>
						</ModalTrigger>
					</div>
					<div className='col-xs-6'>
							<Button className="sidebar-action-link-bottom"
								onClick={ this.destroy }>
								Delete Bevy
							</Button>
					</div>
				</div>)
			: (<div className='row sidebar-bottom'>
					<div className='col-xs-6'>
						{/* user settings */}
					</div>
					<div className='col-xs-6'>
						 <Button className="sidebar-action-link-bottom"
							onClick={ this.leave }>
							Leave Bevy
						  </Button>
					</div>
				</div>)
		}


		return (
			<ButtonGroup className="btn-group right-sidebar panel">
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
								activeMember={ this.props.activeMember }
								contacts={ members }
								title={ <span className='member-modal-title'>Members of <b>{ name }</b></span> } />
						}>
						<Button type='button' className="sidebar-link">
							{ members.length + ' Members' }
						</Button>
						</ModalTrigger>
					</ButtonGroup>
				</div>

				{ nameEditAction }

				<div className='row sidebar-action'>
					<div className="sidebar-action-title col-xs-12"> Notifications </div>
					<DropDownMenu
						className='sidebar-action-dropdown'
						menuItems={ notificationMenuItems }
						onChange={ this.setNotificationLevel }
						selectedIndex={ itemIndex }
					/>
				</div>

				{bottomActions}

			 </ButtonGroup>);
	}
});
module.exports = BevyPanel;
