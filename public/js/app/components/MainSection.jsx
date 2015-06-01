/**
 * MainSection.jsx
 *
 * the main react component of the app. shows posts and allows
 * the user to switch bevys
 *
 * @author albert
 */

'use strict';

// imports
var React = require('react');
var _ = require('underscore');

var router = require('./../../router');

var Navbar = require('./Navbar.jsx');
var PostView = require('./PostView.jsx');
var SearchView = require('./SearchView.jsx');
var PublicView = require('./PublicView.jsx');
var FourOhFour = require('./FourOhFour.jsx');

var PostStore = require('./../../post/PostStore');
var BevyStore = require('./../../bevy/BevyStore');
var NotificationStore = require('./../../notification/NotificationStore');
var UserStore = require('./../../profile/UserStore');

var AppActions = require('./../../app/AppActions');

var POST = require('./../../constants').POST;
var BEVY = require('./../../constants').BEVY;
var NOTIFICATION = require('./../../constants').NOTIFICATION;


// create app
var MainSection = React.createClass({

	// called directly after mounting
	getInitialState: function() {

		AppActions.load();

		return this.collectState();
	},

	// mount event listeners
	componentDidMount: function() {
		PostStore.on(POST.CHANGE_ALL, this._onPostChange);
		BevyStore.on(BEVY.CHANGE_ALL, this._onBevyChange);
		NotificationStore.on(NOTIFICATION.CHANGE_ALL, this._onNotificationChange);
	},

	// unmount event listeners
	componentWillUnmount: function() {
		PostStore.off(POST.CHANGE_ALL, this._onPostChange);
		BevyStore.off(BEVY.CHANGE_ALL, this._onBevyChange);
		NotificationStore.off(NOTIFICATION.CHANGE_ALL, this._onNotificationChange);
	},

	getPostState: function() {
		return {
			allPosts: PostStore.getAll()
		}
	},

	getBevyState: function() {

		var all = BevyStore.getAll();
		var active = BevyStore.getActive();
		var activeMember = BevyStore.getActiveMember();
		var members = BevyStore.getMembers();

		return {
			// later, load this from session/cookies
			allBevies: all,
			activeBevy: active,
			activeMember: activeMember,
			members: members
		}
	},

	getNotificationState: function() {
		return {
			allNotifications: NotificationStore.getAll()
		};
	},

	collectState: function() {
		var state = {};
		_.extend(state,
			this.getPostState(),
			this.getBevyState(),
			this.getNotificationState()
		);
		return state;
	},


	// event listener callbacks
	_onPostChange: function() {
		this.setState(_.extend(this.state, this.getPostState()));
	},
	_onBevyChange: function() {
		this.setState(_.extend(this.state, this.getBevyState()));
	},
	_onNotificationChange: function() {
		this.setState(_.extend(this.state, this.getNotificationState()));
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState(this.collectState());
	},

	render: function(){
		return (
			<div>
				<Navbar
					activeBevy={ this.state.activeBevy }
					allNotifications={ this.state.allNotifications }
				/>
				<InterfaceComponent {...this.state} />
			</div>
		);
	}
});

var InterfaceComponent = React.createClass({
	callback: function() {
		this.forceUpdate();
	},
	componentWillMount : function() {
		router.on('route', this.callback);
	},
	componentWillUnmount : function() {
		router.off('route', this.callback);
	},
	render : function() {
		switch(router.current) {
			case 'search':
				return <SearchView {...this.props} />
				break;
			case 'bevy':
				var bevy = this.props.activeBevy;
				if(_.isEmpty(bevy))
					return <PublicView {...this.props} />
				else
					return <PostView {...this.props} />
				break;
			default:
				return <FourOhFour />
				break;
		}
	}
});

// pipe back to index.js
module.exports = MainSection;
