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
var _ = require('underscore');

var router = require('./../../router');

var rbs = require('react-bootstrap');
var Input = rbs.Input;
var ModalTrigger = rbs.ModalTrigger;
var Button = rbs.Button;
var DropdownButton = rbs.DropdownButton;
var Badge = rbs.Badge;

var mui = require('material-ui');
var IconButton = mui.IconButton;
var TextField = mui.TextField;

var ProfileDropdown = require('./../../profile/components/ProfileDropdown.jsx');
var NotificationDropdown = require('./../../notification/components/NotificationDropdown.jsx');

var user = window.bootstrap.user;

// react component
var Navbar = React.createClass({

	propTypes: {
		activeBevy: React.PropTypes.object,
		allNotifications: React.PropTypes.array
	},

	onKeyUp: function(ev) {
		if(ev.which == 13) {
			// trigger search
			this.onSearch(ev);
		}
	},

	onSearch: function(ev) {
		ev.preventDefault();

		var query = this.refs.search.getValue();

		router.navigate('s/' + query, { trigger: true });
	},

	render: function() {

		var notificationCount = user.notifications.length;
		var counter = (notificationCount <= 0)
		? ''
		: <Badge className='notification-counter'>{ notificationCount }</Badge>

		var navbarStyle;
		if(!_.isEmpty(this.props.activeBevy) && !_.isEmpty(this.props.activeBevy.image_url))
		navbarStyle = { backgroundColor: 'rgba(0,0,0,0)'}

		var name = user.displayName;

		var bevyName;
		if(!_.isEmpty(this.props.activeBevy)) {
			bevyName = this.props.activeBevy.name;
		}

		var backgroundStyle = (_.isEmpty(this.props.activeBevy))
		? {}
		: {
			backgroundImage: 'url(' + this.props.activeBevy.image_url + ')'
		};

		var searchQuery = router.search_query || '';

		return <div className="navbar navbar-fixed-top row" style = { navbarStyle }>
					<div className="background-image" style= { backgroundStyle } />
					<div className='col-xs-4'>
						<div className="navbar-header pull-left">
							<ProfileDropdown />
							<NotificationDropdown
								allNotifications={ this.props.allNotifications }
							/>
							{ counter }
							<span className="navbar-brand navbar-brand-text">{ name }</span>
						</div>
					</div>

					<div className='col-xs-4'>
						<div className="nav navbar-brand-text nav-center">
							{ bevyName }
						</div>
					</div>

					<div className='col-xs-4'>
						<div className="navbar-header pull-right">
							<form className="navbar-form navbar-right" role="search">
								<TextField
									type='text'
									className='search-input'
									ref='search'
									onKeyUp={ this.onKeyUp }
									defaultValue={ searchQuery }
								/>
								<IconButton
									iconClassName='glyphicon glyphicon-search'
									onClick={ this.onSearch }
								/>
							</form>
						</div>
					</div>

				</div>;
	}
});

module.exports = Navbar;
