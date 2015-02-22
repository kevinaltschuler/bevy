/**
 * Navbar.jsx
 *
 * The top navbar of the application
 * automatically added to every page, no matter
 * what the route is (see index.js)
 *
 * Also contains the code for the toggleable
 * LeftNav
 *
 * TODO: fix lag issues?
 *
 * @author albert
 */

'use strict';

// imports
var React = require('react');

var ProfileModal = require('./../../modals/components/ProfileModal.jsx');

var rbs = require('react-bootstrap');
var Input = rbs.Input;
var ModalTrigger = rbs.ModalTrigger;
var Button = rbs.Button;

var mui = require('material-ui');
var IconButton = mui.IconButton;
var TextField = mui.TextField;
var LeftNav = mui.LeftNav;

// mixins to enable navigation
var Navigation = require('react-router').Navigation;
var State = require('react-router').State;

// menu items to generate on the left nav
var menuItems = [{ route: 'login', text: 'Login'},
					{ route: 'profile', text: 'Profile Page'},
					{ route: 'sample-bevy', text: 'Sample Bevy' }];

// react component
var Navbar = React.createClass({
	mixins: [Navigation, State],

	toggle: function() {
		this.refs.leftNav.toggle();
	},

	/**
	 * triggered whenever a left nav button is pressed
	 * @param  e - the browser event
	 * @param  key - index of the item in the menu
	 * @param  menuItem - the menu item triggered
	 * (same as the ones defined above)
	 */
	_onLeftNavChange: function(e, key, menuItem) {
		this.transitionTo(menuItem.route);
	},

	render: function() {

		var header = <div className='logo'>bevy logo here</div>;

		return	<div className="navbar navbar-fixed-top">
						<LeftNav docked={false} isInitiallyOpen={ false } ref="leftNav"
						menuItems={menuItems} onChange={ this._onLeftNavChange } header={ header }/>
						<div className="navbar-header pull-left">
							<a className="navbar-brand">
								<IconButton iconClassName="glyphicon glyphicon-menu-hamburger" onTouchTap={ this.toggle }/>
							</a>
						</div>
						<ModalTrigger modal={<ProfileModal />}>
							<Button className="navbar-brand navbar-brand-text">Bevy</Button>
						</ModalTrigger>
						<div className="navbar-header pull-right" id="bs-example-navbar-collapse-1">
							<form className="navbar-form navbar-right" role="search">
								<div className="form-group">
									<TextField type="text" className="search-input" placeholder=" "/>
								</div>
								<IconButton iconClassName="glyphicon glyphicon-search" href="#"/>
							</form>
						</div>
					</div>;
	}
});

module.exports = Navbar;
