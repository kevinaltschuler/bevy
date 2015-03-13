/**
 * ProfileDropdown.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var OverlayTrigger = rbs.OverlayTrigger;
var Button = rbs.Button;
var Popover = rbs.Popover;
var ButtonGroup = rbs.ButtonGroup;

var mui = require('material-ui');
var FlatButton = mui.FlatButton;

var user = window.bootstrap.user;
var email = user.email;


var ProfileDropdown = React.createClass({

	render: function() {

		return	<OverlayTrigger trigger="click" placement="bottom" overlay={
						<Popover>
							<div className="row profile-top">
								<div className="col-xs-3 profile-picture">
									<img src=""/>
								</div>
								<div className="col-xs-9 profile-details">
									<span className='profile-name'>Kevin Altschuler</span>
									<span className='profile-email'>{ email }</span>
									<span className='profile-points'>123 points</span>
								</div>
							</div>
							<div className='row profile-links'>
								<ButtonGroup className="col-xs-12" role="group">
									<Button type='button' className="profile-link">
										Saved Posts
									</Button>
									•
									<Button type='button' className="profile-link">
										Contacts
									</Button>
									•
									<Button type='button' className="profile-link">
										Settings
									</Button>
								</ButtonGroup>
							</div>
							<div className="profile-buttons">
								<div className="profile-btn-left">
									<FlatButton label="Add Account"/>
								</div>
								<div className="profile-btn-right">
									<FlatButton label="Logout"/>
								</div>
							</div>
						</Popover>}>
					<Button className="profile-btn" bsStyle="default"/>
				</OverlayTrigger>;
	}
});
module.exports = ProfileDropdown;
