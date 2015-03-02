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

var PostStore = require('./../../post/PostStore');
var BevyStore = require('./../../bevy/BevyStore');

var POST = require('./../../constants').POST;


/**
 * update posts by getting the collection from the store
 * @return [post_obj] collection of post models - refer to PostStore.js for more details
 */
function getPostState() {
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

function collectState() {
	var state = {};
	_.extend(state, getPostState());
	_.extend(state, getBevyState());
	return state;
}

// create app
var MainSection = React.createClass({
	// called directly after mounting
	getInitialState: function() {
		// init posts
		PostStore.initialize();
		BevyStore.initialize();

		return collectState();
	},

	// mount event listeners
	componentDidMount: function() {
		PostStore.on(POST.CHANGE_ALL, this._onPostChange);
		BevyStore.on('change', this._onBevyChange);
	},

	// unmount event listeners
	componentWillUnmount: function() {
		PostStore.off(POST.CHANGE_ALL, this._onPostChange);
		BevyStore.off('change', this._onBevyChange);
	},

	// event listener callbacks
	_onPostChange: function() {
		this.setState(_.extend(this.state, getPostState()));
	},

	_onBevyChange: function() {
		this.setState(_.extend(this.state, getBevyState()));
	},

	render: function(){
		return	<div className='container'>
						<Navbar />
						<div className='row'>
							<div className='main-section col-xs-12'>
								<div className="row">
									<PostSubmit />
									<PostSort />
								</div>
								<LeftSidebar allBevies={ this.state.allBevies } activeBevy={ this.state.activeBevy }/>
								<PostContainer allPosts={ this.state.allPosts } activeBevy={ this.state.activeBevy }/>
								<RightSidebar activeBevy={ this.state.activeBevy }/>
							</div>
						</div>
					</div>;
	}
});

// pipe back to index.js
module.exports = MainSection;
