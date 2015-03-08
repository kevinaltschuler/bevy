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

var ProfileDropdown = React.createClass({

	render: function() {
		return	<OverlayTrigger trigger="click" placement="bottom" overlay={
						<Popover title="Popover bottom">
							<strong>Holy guacamole!</strong> Check this info.
						</Popover>}>
					<Button className="profile-btn" bsStyle="default"/>
				</OverlayTrigger>;
	}
});
module.exports = ProfileDropdown;
