/**
 * ProfileDropdown.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var OverlayTrigger = rbs.OverlayTrigger;
var ModalTrigger = rbs.ModalTrigger;
var Button = rbs.Button;
var Popover = rbs.Popover;
var ButtonGroup = rbs.ButtonGroup;
var DropdownButton = rbs.DropdownButton;
var MenuItem = rbs.MenuItem;
var OverlayMixin = rbs.OverlayMixin;

var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var TextField = mui.TextField;

var SavedPostsModal = require('./../../profile/components/SavedPostsModal.jsx');
var ContactsModal = require('./../../profile/components/ContactsModal.jsx');
var Uploader = require('./../../shared/components/Uploader.jsx');

var UserActions = require('./../UserActions');
var constants = require('./../../constants');

var user = window.bootstrap.user;

var defaultProfileImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

var ProfileDropdown = React.createClass({

	//mixins: [OverlayMixin],

	getInitialState: function() {
		return {
			isOverlayOpen: false,
			image_url: (user.image_url) ? user.image_url : defaultProfileImage
		}
	},

	onUploadComplete: function(file) {
		//console.log(file);
		var filename = file.filename;
		var image_url = constants.apiurl + '/files/' + filename;
		image_url += '?w=100&h=100';
		this.setState({
			image_url: image_url
		});

		UserActions.update(image_url);
	},

	onChange: function(ev) {
		this.setState({
			name: this.refs.name.getValue(),
		});
	},

	handleToggle: function(ev) {
		ev.preventDefault();

		this.setState({
			isOverlayOpen: !this.state.isOverlayOpen
		});
	},

	renderOverlay: function() {
		if(!this.state.isOverlayOpen) return <span />;

		var name = user.displayName;
		var email = (_.isEmpty(user.google.name))
		? ''
		: (<span className='profile-email'>{ user.email }</span>)

		var dropzoneOptions = {
			maxFiles: 1,
			acceptedFiles: 'image/*',
			clickable: '.dropzone-panel-button',
			dictDefaultMessage: ' ',
		};

		var profileImage;
		if(_.isEmpty(this.state.image_url)) {
			profileImage = defaultProfileImage;
			var profileImageStyle= {
				backgroundImage: 'url(' + profileImage + ')',
				backgroundSize: '75px 75px'
			};
		} else {
			profileImage =  this.state.image_url;
			var profileImageStyle = {
				backgroundImage: 'url(' + profileImage + ')',
			}
		}

		return (
			<div className='profile-dropdown'>
				<div className='profile-backdrop' onClick={ this.handleToggle }></div>
				<Popover placement='bottom' container={this} >
					<div className="row profile-top">
						<div className="col-xs-3 profile-picture overlay">
							<Uploader
								onUploadComplete={ this.onUploadComplete }
								className="profile-image-dropzone"
								style={ profileImageStyle }
								dropzoneOptions={ dropzoneOptions }
							/>
						</div>
						<div className="col-xs-6 profile-details">
							<span className='profile-name'>{ name }</span>
							{ email }
							<span className='profile-points'>123 points</span>
						</div>
						<div className="col-xs-3">
							<DropdownButton
								noCaret
								pullRight
								className="profile-settings"
								title={<span className="glyphicon glyphicon-option-vertical btn"></span>}>
								<MenuItem>
									Delete Account
								</MenuItem>
							</DropdownButton>
						</div>
					</div>
					{/* <div className='row profile-links'>
						<ButtonGroup className="col-xs-12" role="group">
							<ModalTrigger modal = { <SavedPostsModal /> } >
								<Button type='button' className="profile-link">
									Saved Posts
								</Button>
							</ModalTrigger>
							•
							<ModalTrigger modal = { <ContactsModal  title="Your Contacts" /> } >
								<Button type='button' className="profile-link">
									Contacts
								</Button>
							</ModalTrigger>
						</ButtonGroup>
					</div>*/}

					<hr />

					<div className="profile-dropdown-buttons">
						<div className="profile-btn-left">

						</div>
						<div className="profile-btn-right">
							<FlatButton
								label="Logout"
								linkButton={ true }
								href='/logout' />
						</div>
					</div>
				</Popover>
			</div>
		);
	},

	render: function() {

		var profileImage;
		if(_.isEmpty(this.state.image_url)) {
			profileImage = defaultProfileImage;
			var profileImageStyle= {
				backgroundImage: 'url(' + profileImage + ')',
				backgroundSize: '75px 75px'
			};
		} else {
			profileImage =  this.state.image_url;
			var profileImageStyle = {
				backgroundImage: 'url(' + profileImage + ')',
			}
		}

		var buttonStyle = {
			backgroundImage: 'url(' + profileImage + ')'
		};

		return (
			<div className='profile-dropdown-wrapper' id='profile-dropdown-wrapper'>
				<Button className="profile-btn" onClick={ this.handleToggle } style={ buttonStyle } />
				{ this.renderOverlay() }
			</div>
		);
	}
});
module.exports = ProfileDropdown;
