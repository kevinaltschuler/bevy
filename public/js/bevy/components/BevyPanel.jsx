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
		return {
			name: '',
			description: '',
			image_url: '',
			activeMember: null,
			isEditing: false
		};
	},

	componentWillReceiveProps: function(nextProps) {
		var bevy = nextProps.activeBevy;

		this.setState({
			name: bevy.get('name'),
			description: bevy.get('description'),
			image_url: bevy.get('image_url'),
			activeMember: nextProps.activeMember
		});
	},

	startEditing: function(ev) {
		//console.log('start editing');
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

	onUploadComplete: function(file) {
		//console.log(file);
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

	onKeyUp: function(ev) {
	},

	onChange: function(ev) {
		this.setState({
			name: this.refs.name.getValue(),
			description: this.refs.description.getValue()
		});
	},

	setNotificationLevel: function(ev, selectedIndex, menuItem) {
		ev.preventDefault();

		var bevy_id = this.props.activeBevy.id;
		var user = window.bootstrap.user;
		var level = menuItem.payload;

		BevyActions.setNotificationLevel(bevy_id, user._id, level);

		// now update locally
		var activeMember = this.state.activeMember;
		activeMember.level = level;

		this.setState({
			activeMember: activeMember
		});
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
		var bevyImage = (_.isEmpty(this.state.image_url)) ? '/img/logo_100.png' : this.state.image_url;
		var bevyImageStyle= {
			backgroundImage: 'url(' + bevyImage + ')',
			backgroundSize: '100% 100%',
			display: 'inline-block',
			borderRadius: '50px',
			width: '50px',
			height: '50px',
		}

		var name = (_.isEmpty(bevy)) ? 'not in a bevy' : this.state.name;
		var description = (_.isEmpty(bevy)) ? 'no description' : this.state.description;
		if(_.isEmpty(description)) description = 'no description';

		var notificationMenuItems = [
		   { payload: 'all', text: 'All Posts', defaultIndex: 0 },
		   { payload: 'my', text: 'My Posts', defaultIndex: 1 },
		   { payload: 'never', text: 'Never', defaultIndex: 2 },
		];

		var members = (_.isEmpty(bevy)) ? [] : bevy.get('members');

		var member = this.state.activeMember
		var itemIndex;
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

		var header;
		if(this.state.isEditing) {
			header = <div>
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
						</div>;

		} else {
			header = <div className="row sidebar-top">
							<div className="col-xs-3 sidebar-picture">
								<img src={ bevyImage } />
							</div>
							<div className="col-xs-9 sidebar-title">
								<span
									className='sidebar-title-name'
									onDoubleClick={ this.startEditing } >
									{ name }
								</span>
								{ editButton }
								<span
									className='sidebar-title-description'
									onDoubleClick={ this.startEditing } >
									{ description }
								</span>
							</div>
						</div>;
		}

		var destroyButton = '';
		if(this.state.activeMember) {
			destroyButton = (this.state.activeMember.role == 'admin')
			? (<Button className="sidebar-action-link-bottom"
					onClick={ this.destroy }>
					Delete Bevy
				</Button>)
			: '';
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
									activeMember={ this.props.activeMember }
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
						<div className="sidebar-action-title col-xs-12"> Posting As... </div>
						<span
							className='sidebar-posting-name'>
						</span>
						{ editButton }
					</div>

					<div className='row sidebar-action'>
						<div className="sidebar-action-title col-xs-12"> Notifications </div>
						<DropDownMenu
							className='sidebar-action-dropdown'
							menuItems={ notificationMenuItems }
							onChange={ this.setNotificationLevel }
							selectedIndex={ itemIndex }
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
							{ destroyButton }
						</div>
					</div>

				 </ButtonGroup>
	}
});
module.exports = BevyPanel;
