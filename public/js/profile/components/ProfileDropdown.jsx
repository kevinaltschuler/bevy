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

var mui = require('material-ui');
var FlatButton = mui.FlatButton;

var SavedPostsModal = require('./../../profile/components/SavedPostsModal.jsx');
var ContactsModal = require('./../../profile/components/ContactsModal.jsx');

var user = window.bootstrap.user;
var email = user.email;

var ProfileDropdown = React.createClass({

	propTypes: {

	},

	render: function() {

		var defaultProfileImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';
		var profileImage = (_.isEmpty(user.google.photos))
		 ? defaultProfileImage
		 : user.google.photos[0].value;

		var defaultName = 'Default Name';
		var name = user.google.displayName || defaultName;

		var buttonStyle = {
			backgroundImage: 'url(' + profileImage + ')'
		};

		return <OverlayTrigger trigger="click" placement="bottom" overlay={
					<Popover>

						<div className="row profile-top">
							<div className="col-xs-3 profile-picture">
								<img src={ profileImage }/>
							</div>
							<div className="col-xs-6 profile-details">
								<span className='profile-name'>{ name }</span>
								<span className='profile-email'>{ email }</span>
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

						<div className="profile-buttons">
							<div className="profile-btn-left">

							</div>
							<div className="profile-btn-right">
								<FlatButton
									label="Logout"
									linkButton={ true }
									href='/logout' />
							</div>
						</div>
					</Popover>}>
				<Button className="profile-btn" style={ buttonStyle } />
			 </OverlayTrigger>;
	}
});
module.exports = ProfileDropdown;
