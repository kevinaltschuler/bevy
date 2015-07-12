/* frontpage.js
* what you see when you first login
* ye
* made by keivn altschuler
*/

'use strict';

// imports
var React = require('react');
var _ = require('underscore');

var router = require('./../../router');
var rbs = require('react-bootstrap');
var ModalTrigger = rbs.ModalTrigger;
var Tooltip = rbs.Tooltip;
var OverlayTrigger = rbs.OverlayTrigger;
var Button = rbs.Button;

var mui = require('material-ui');
var FontIcon = mui.FontIcon;
var FlatButton = mui.FlatButton;

var ChatDock = require('./../../chat/components/ChatDock.jsx');
var CreateNewBevy = require('./../../bevy/components/CreateNewBevy.jsx');

var BevyStore = require('./../../bevy/BevyStore');
var UserStore = require('./../../profile/UserStore');

var AppActions = require('./../../app/AppActions');

var constants = require('./../../constants');

var HomeView = React.createClass({
	render: function() {
		return (
		<div className='landing-page'>
			<div className='div1'>
				<div className='title-text'>
				A Social Network Built For Your Community
				</div>
			</div>
			<div className='div2'>
				<img src='./../../../img/communities.png'/>
					<ModalTrigger modal={
						<CreateNewBevy	/>
					}>
						<OverlayTrigger placement='bottom' overlay={ <Tooltip>Create a New Bevy</Tooltip> }>
							<Button className='new-bevy-btn'>
								<FontIcon className="glyphicon glyphicon-plus"/>
							</Button>
						</OverlayTrigger>
					</ModalTrigger>
			</div>
		</div>
		)
	}
});

module.exports = HomeView;