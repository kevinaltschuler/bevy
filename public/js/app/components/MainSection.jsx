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

var LeftSidebar = require('./LeftSidebar.jsx');
var RightSidebar = require('./RightSidebar.jsx');

var Navbar = require('./Navbar.jsx');
var PostSubmit = require('./../../post/components/PostSubmit.jsx');
var PostSort = require('./../../post/components/PostSort.jsx');
var PostContainer = require('./../../post/components/PostContainer.jsx');
var NewPostPanel = require('./../../post/components/NewPostPanel.jsx')

var PostStore = require('./../../post/PostStore');
var BevyStore = require('./../../bevy/BevyStore');
var AliasStore = require('./../../alias/AliasStore');
var NotificationStore = require('./../../notification/NotificationStore');

var POST = require('./../../constants').POST;
var BEVY = require('./../../constants').BEVY;
var ALIAS = require('./../../constants').ALIAS;
var NOTIFICATION = require('./../../constants').NOTIFICATION;


/**
 * update posts by getting the collection from the store
 * @return [post_obj] collection of post models - refer to PostStore.js for more details
 */
function getPostState() {
	//console.log(PostStore.getAll());
	return {
		allPosts: PostStore.getAll()
	}
}

function getBevyState() {
	return {
			// later, load this from session/cookies
		  activeBevy: BevyStore.getActive()
		, allBevies: BevyStore.getAll()
	}
}
function getAliasState() {
	return {
		  allAliases: AliasStore.getAll()
		, activeAlias: AliasStore.getActive()
	}
}
function getNotificationState() {
	return {
		allNotifications: NotificationStore.getAll()
	};
}

function collectState() {
	var state = {};
	_.extend(state
		, getPostState()
		, getBevyState()
		, getAliasState()
		, getNotificationState()
	);
	return state;
}

// create app
var MainSection = React.createClass({
	// called directly after mounting
	getInitialState: function() {
		return collectState();
	},

	// mount event listeners
	componentDidMount: function() {
		PostStore.on(POST.CHANGE_ALL, this._onPostChange);
		BevyStore.on(BEVY.CHANGE_ALL, this._onBevyChange);
		AliasStore.on(ALIAS.CHANGE_ALL, this._onAliasChange);
		NotificationStore.on(NOTIFICATION.CHANGE_ALL, this._onNotificationChange);
	},

	// unmount event listeners
	componentWillUnmount: function() {
		PostStore.off(POST.CHANGE_ALL, this._onPostChange);
		BevyStore.off(BEVY.CHANGE_ALL, this._onBevyChange);
		AliasStore.off(ALIAS.CHANGE_ALL, this._onAliasChange);
		NotificationStore.off(NOTIFICATION.CHANGE_ALL, this._onNotificationChange);
	},

	// event listener callbacks
	_onPostChange: function() {
		this.setState(_.extend(this.state, getPostState()));
	},
	_onBevyChange: function() {
		this.setState(_.extend(this.state, getBevyState()));
	},
	_onAliasChange: function() {
		this.setState(_.extend(this.state, getAliasState()));
	},
	_onNotificationChange: function() {
		this.setState(_.extend(this.state, getNotificationState()));
	},

	render: function(){
		return	<div>
						<Navbar
							activeBevy={ this.state.activeBevy }
							allAliases={ this.state.allAliases }
							activeAlias={ this.state.activeAlias }
							allNotifications={ this.state.allNotifications }/>
						<div className='main-section'>
							<div className='row'>
								<NewPostPanel
									activeBevy={ this.state.activeBevy }
									activeAlias={ this.state.activeAlias } />
							</div>
							<div className='row'>
								<PostSort />
							</div>
							<div className='row'>
								<LeftSidebar allBevies={ this.state.allBevies } activeBevy={ this.state.activeBevy }/>
								<PostContainer allPosts={ this.state.allPosts } activeBevy={ this.state.activeBevy }/>
								<RightSidebar
									activeAlias={ this.state.activeAlias }
									activeBevy={ this.state.activeBevy }/>
							</div>
						</div>
					</div>;
	}
});

// pipe back to index.js
module.exports = MainSection;
