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
 * @author kevin
 */

'use strict';

// imports
var React = require('react');

var ProfileModal = require('./../../modals/components/ProfileModal.jsx');

var rbs = require('react-bootstrap');
var Input = rbs.Input;
var ModalTrigger = rbs.ModalTrigger;
var Button = rbs.Button;
var DropdownButton = rbs.DropdownButton;

var mui = require('material-ui');
var IconButton = mui.IconButton;
var TextField = mui.TextField;

var ProfileDropdown = require('./../../profile/components/ProfileDropdown.jsx');

// react component
var Navbar = React.createClass({

	propTypes: {
		  activeBevy: React.PropTypes.object
		, allAliases: React.PropTypes.array
		, activeAlias: React.PropTypes.object
	},

	render: function() {

		return	<div className="navbar navbar-fixed-top">

						<div className="navbar-header pull-left">
							<ProfileDropdown allAliases={ this.props.allAliases } activeAlias={ this.props.activeAlias } />
							<span className="navbar-brand navbar-brand-text">Bevy</span>
						</div>
						<div className="nav navbar-brand-text nav-center">
							{ this.props.activeBevy.get('name') }
						</div>
						<div className="navbar-header pull-right">
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
