'use strict';

var React = require('react');

var router = require('./../../router');

var PostSort = require('./../../post/components/PostSort.jsx');
var PostContainer = require('./../../post/components/PostContainer.jsx');
var NewPostPanel = require('./../../post/components/NewPostPanel.jsx');
var LeftSidebar = require('./LeftSidebar.jsx');
var RightSidebar = require('./RightSidebar.jsx');

var BevyActions = require('./../../bevy/BevyActions');

var PostView = React.createClass({

	propTypes: {

	},

	getInitialState: function() {
		return {};
	},

	render: function() {

		return (
			<div className='main-section'>
				<div className='row'>
					<NewPostPanel
						activeBevy={ this.props.activeBevy }
						allBevies={ this.props.allBevies }
					/>
				</div>
				<div className='row'>
					<PostSort />
				</div>
				<div className='row'>
					<LeftSidebar
						allBevies={ this.props.allBevies }
						activeBevy={ this.props.activeBevy }
					/>
					<PostContainer
						allPosts={ this.props.allPosts }
						activeMember={ this.props.activeMember }
						activeBevy={ this.props.activeBevy }
					/>
					<RightSidebar
						activeBevy={ this.props.activeBevy }
						activeMember={ this.props.activeMember }
					/>
				</div>
			</div>
		);
	}
});

module.exports = PostView;
