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
						<Popover title="Profile">
							<div className="row profile-top">
								<div className="col-xs-4">
									<img src=""/>
								</div>
								<div className="col-xs-8 profile-details">
									Kevin Altschuler
									<br/>{email}
									<br/>123 points
										<ButtonGroup className="col-xs-12" role="group">
											<Button type='button' className="btn sort-btn">
												Saved Posts
											</Button>
											•
											<Button type='button' className="btn sort-btn">
												Contacts
											</Button>
											•
											<Button type='button' className="btn sort-btn">
												Settings
											</Button>
										</ButtonGroup> 
								</div>
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
