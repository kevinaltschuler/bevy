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


/**
 * update posts by getting the collection from the store
 * @return [post_obj] collection of post models - refer to PostStore.js for more details
 */
function getPostState() {
	return {
		allPosts: PostStore.getAll()
	}
}
// create app
var MainSection = React.createClass({
	// called directly after mounting
	getInitialState: function() {
		// init posts
		PostStore.initialize();
		return getPostState();
	},

	// mount event listeners
	componentDidMount: function() {
		PostStore.on('change', this._onPostChange);
	},

	// unmount event listeners
	componentWillUnmount: function() {
		PostStore.off('change', this._onPostChange);
	},

	// event listener callbacks
	_onPostChange: function() {
		this.setState(getPostState());
	},

	render: function(){
		return	<div>
					<Navbar />
					<div className="Container col-xs-12">
						<div className="row">
							<PostSubmit />
							<PostSort />
						</div>
						<LeftSidebar />
						<PostContainer allPosts={ this.state.allPosts } />
						<RightSidebar />
					</div>
				</div>;
	}
});

// pipe back to index.js
module.exports = MainSection;
