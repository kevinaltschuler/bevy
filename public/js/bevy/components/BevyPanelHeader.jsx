	/**
 * BevyPanelHeader.jsx
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

var BevyPanelHeader = React.createClass({

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
			activeMember: member || null,
			isEditing: false
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

	onUploadComplete: function(file) {
		var filename = file.filename;
		var image_url = constants.apiurl + '/files/' + filename;
		image_url += '?w=100&h=100';
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

		var name = (_.isEmpty(bevy)) ? 'not in a bevy' : this.state.name;
		var description = (_.isEmpty(bevy)) ? 'no description' : this.state.description;
		if(_.isEmpty(description)) description = 'no description';


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

		var dropzoneOptions = {
			maxFiles: 1,
			acceptedFiles: 'image/*',
			clickable: '.dropzone-panel-button',
			dictDefaultMessage: ' ',
		};


		if (this.state.isEditing) {
			return (<div>
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
							<RaisedButton label="save changes" onClick={this.stopEditing} />
						</div>
					</div>
				</div>)
		}
		else {
			return (<div className="row sidebar-top">
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
			</div>)
		}
	}
})
module.exports = BevyPanelHeader;
