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

var rbs = require('react-bootstrap');
var Button = rbs.Button;

var Navbar = require('./Navbar.jsx');
var HomeView = require('./../../homepage/components/HomeView.jsx');
var PostView = require('./PostView.jsx');
var SearchView = require('./SearchView.jsx');
var FourOhFour = require('./FourOhFour.jsx');
var PublicBevyList = require('./PublicBevyList.jsx');

var PostStore = require('./../../post/PostStore');
var BevyStore = require('./../../bevy/BevyStore');
var NotificationStore = require('./../../notification/NotificationStore');
var UserStore = require('./../../profile/UserStore');
var ChatStore = require('./../../chat/ChatStore');

var AppActions = require('./../../app/AppActions');

var constants = require('./../../constants');

var POST = constants.POST;
var BEVY = constants.BEVY;
var NOTIFICATION = constants.NOTIFICATION;
var CHAT = constants.CHAT;

var change_all_events = [
	POST.CHANGE_ALL,
	BEVY.CHANGE_ALL,
	NOTIFICATION.CHANGE_ALL,
	CHAT.CHANGE_ALL
].join(' ');

// create app
var MainSection = React.createClass({

	// called directly after mounting
	getInitialState: function() {

		AppActions.load();

		return this.collectState();
	},

	// mount event listeners
	componentDidMount: function() {
		PostStore.on(change_all_events, this._onPostChange);
		BevyStore.on(change_all_events, this._onBevyChange);
		NotificationStore.on(change_all_events, this._onNotificationChange);
		ChatStore.on(change_all_events, this._onChatChange);
	},

	// unmount event listeners
	componentWillUnmount: function() {
		PostStore.off(change_all_events, this._onPostChange);
		BevyStore.off(change_all_events, this._onBevyChange);
		NotificationStore.off(change_all_events, this._onNotificationChange);
		ChatStore.off(change_all_events, this._onChatChange);
	},

	getPostState: function() {
		return {
			allPosts: PostStore.getAll(),
			sortType: PostStore.getSort()
		}
	},

	getBevyState: function() {

		var myBevies = BevyStore.getMyBevies();
		var active = BevyStore.getActive();
		var publicBevies = BevyStore.getPublicBevies();
		var searchList = BevyStore.getSearchList();
		var searchQuery = BevyStore.getSearchQuery();

		return {
			// later, load this from session/cookies
			myBevies: myBevies,
			activeBevy: active,
			publicBevies: publicBevies,
			searchList: searchList,
			searchQuery: searchQuery
		}
	},

	getNotificationState: function() {
		return {
			allNotifications: NotificationStore.getAll()
		};
	},

	getChatState: function() {
		return {
			allThreads: ChatStore.getAllThreads(),
			openThreads: ChatStore.getOpenThreads(),
			activeThread: ChatStore.getActiveThread()
		};
	},

	collectState: function() {
		var state = {};
		_.extend(state,
			this.getPostState(),
			this.getBevyState(),
			this.getNotificationState(),
			this.getChatState()
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
	_onChatChange: function() {
		this.setState(_.extend(this.state, this.getChatState()));
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState(this.collectState());
	},

	render: function() {
		return (
			<div className='main-section-wrapper'>
				<Navbar
					activeBevy={ this.state.activeBevy }
					allNotifications={ this.state.allNotifications }
					myBevies={ this.state.myBevies }
					allThreads={ this.state.allThreads }
					activeThread={ this.state.activeThread }
					openThreads={ this.state.openThreads }
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

		//console.log(this.props.activeThread);

		switch(router.current) {
			case 'home': 
				return <HomeView {...this.props}  />
				break;
			case 'search':
				return <PublicBevyList {...this.props} />
				break;
			case 'bevy':
				return <PostView {...this.props} />
				break;
			case 'publicbevies':
				return <PublicBevyList {...this.props} />
				break;
			default:
				return <FourOhFour {...this.props} />
				break;
		}
	}
});

// pipe back to index.js
module.exports = MainSection;
