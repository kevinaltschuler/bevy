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
var MenuItem = rbs.MenuItem;
var SplitButton = rbs.SplitButton;

var mui = require('material-ui');
var IconButton = mui.IconButton;
var TextField = mui.TextField;

var ProfileDropdown = require('./../../profile/components/ProfileDropdown.jsx');
var NotificationDropdown = require('./../../notification/components/NotificationDropdown.jsx');
var ChatDropdown = require('./../../chat/components/ChatDropdown.jsx');
var ChatDock = require('./../../chat/components/ChatDock.jsx');
var ChatSidebar = require('./../../chat/components/ChatSidebar.jsx');

var user = window.bootstrap.user;

// react component
var Navbar = React.createClass({

	propTypes: {
		myBevies: React.PropTypes.array.isRequired,
		activeBevy: React.PropTypes.object,
		allNotifications: React.PropTypes.array,
		allThreads: React.PropTypes.array,
		activeThread: React.PropTypes.object,
		allContacts: React.PropTypes.array,
		openThreads: React.PropTypes.array
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

	switchBevy: function( ev, href, target) {
		//console.log('ev: ', ev,'href: ', href,'target: ', target);
		// get the bevy ids
		var id = ev || null;
		if(id == -1) id = 'Bevies';
		// call action
		router.navigate('/b/' + id, { trigger: true });
	},

	render: function() {

		var notificationCount = this.props.allNotifications.length;
		var counter = (notificationCount <= 0)
		? ''
		: <Badge className='notification-counter'>{ notificationCount }</Badge>;

		var navbarStyle;
		if(!_.isEmpty(this.props.activeBevy) && !_.isEmpty(this.props.activeBevy.image_url))
			navbarStyle = { backgroundColor: 'rgba(0,0,0,0)'};
		if(router.current == 'home')
			navbarStyle = { boxShadow: 'none'};

		var name = user.displayName;

		var bevyName;
		if(!_.isEmpty(this.props.activeBevy)) {
			bevyName = this.props.activeBevy.name;
		}

		var myBevies = this.props.myBevies;
		var bevies = [];

		for(var key in myBevies) {
			var bevy = myBevies[key];

			if(bevy != this.props.activeBevy && bevy.parent == undefined) {
				bevies.push(
					<MenuItem
						eventKey={ bevy._id }
						id={ bevy._id }
						target={ bevy._id }
						onSelect={ this.switchBevy } 
					>
						{ bevy.name }
					</MenuItem>
				);
			}
		}
		
		var backgroundStyle = (_.isEmpty(this.props.activeBevy))
		? {}
		: {
			backgroundImage: 'url(' + this.props.activeBevy.image_url + ')'
		};

		var searchQuery = router.search_query || '';

		var frontpageUrl = (window.bootstrap.user) ? '/bevies' : '/';

		var userContent = (_.isEmpty(window.bootstrap.user))
		?	(<a className="navbar-brand navbar-brand-text" href='/login'> Log In </a>)
		:	(<div className='profile-buttons'>
				<ChatSidebar
					allContacts={ this.props.allContacts }  
					allThreads={ this.props.allThreads } 
					activeThread={ this.props.activeThread }
				/>
				<ChatDock openThreads={ this.props.openThreads } />
				<NotificationDropdown
					allNotifications={ this.props.allNotifications }
				/>
				{ counter }
				<ProfileDropdown />
			</div>);

		var bevyDropdown = (_.isEmpty(window.bootstrap.user))
		? (<Button href='/bevies' className='bevies-dropdown'>Bevies</Button>)
		: (<SplitButton className='bevies-dropdown' title='Bevies' href='/publicbevies'>
				{bevies}
			</SplitButton>)

		return <div id='navbar' className="navbar navbar-fixed-top row" style = { navbarStyle }>
					<div className='background-wrapper'>
						<div className="background-image" style= { backgroundStyle } />
					</div>
					<div className="navbar-header pull-left">
						<Button className="bevy-logo-btn" href={frontpageUrl}>
							<div className='bevy-logo-img'/>
						</Button>
						{bevyDropdown}
					</div>

					<div className="nav navbar-brand-text nav-center">
						{bevyName}
					</div>

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
						{ userContent }
					</div>

				</div>;
	}
});

module.exports = Navbar;
