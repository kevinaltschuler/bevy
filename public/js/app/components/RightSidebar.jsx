'use strict';

var React = require('react');
var ReactPropTypes = React.PropTypes;
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Badge = rbs.Badge;
var ButtonGroup = rbs.ButtonGroup;
var MenuItem = rbs.MenuItem;
var Accordion = rbs.Accordion;
var Panel = rbs.Panel;
var Button = rbs.Button;

var mui = require('material-ui');
var DropDownMenu = mui.DropDownMenu;

var NotificationHeader;

module.exports = React.createClass({

	propTypes: {
		activeBevy: ReactPropTypes.object
	},

	render: function() {

		var defaultBevyImage = './../../../img/logo_100.png';
		var bevyImage = "/"
		var bevyName = (_.isEmpty(this.props.activeBevy)) ? 'not in a bevy' : this.props.activeBevy.get('name');
		var notificationMenuItems = [
		   { payload: '1', text: 'All Posts' },
		   { payload: '2', text: 'My Posts' },
		   { payload: '3', text: 'Never' },
		];


		return	<ButtonGroup className="col-sm-3 hidden-xs btn-group right-sidebar panel">
					<div className="row sidebar-top">
						<div className="col-xs-3 sidebar-picture">
							<img src={ defaultBevyImage }/>
						</div>
						<div className="col-xs-9 sidebar-title">
							<span className='sidebar-title-name'>{ bevyName }</span>
							<span className='sidebar-title-description'>The Frontpage</span>
						</div>
					</div>

					<div className='row sidebar-links'>
						<ButtonGroup className="col-xs-12" role="group">
							<Button type='button' className="sidebar-link">
								Invite People
							</Button>
							•
							<Button type='button' className="sidebar-link">
								21 Members
							</Button>
						</ButtonGroup>
					</div>

					<div className='row sidebar-action'>
						<div className="sidebar-action-title col-xs-12"> Currently Viewing </div>
						<Button type='button' className="sidebar-action-link">
							Nobody
						</Button>
					</div>
					<div className='row sidebar-action'>
						<div className="sidebar-action-title col-xs-12"> Notifications </div>
						<DropDownMenu menuItems={notificationMenuItems} />
					</div>


				</ButtonGroup>
				;
	}
});
