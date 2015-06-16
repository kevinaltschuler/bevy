'use strict';

var React = require('react');

var router = require('./../../router');

var PostSort = require('./../../post/components/PostSort.jsx');
var PostContainer = require('./../../post/components/PostContainer.jsx');
var NewPostPanel = require('./../../post/components/NewPostPanel.jsx');
var LeftSidebar = require('./LeftSidebar.jsx');
var RightSidebar = require('./RightSidebar.jsx');
var Lonesome = require('./Lonesome.jsx');

var BevyActions = require('./../../bevy/BevyActions');

var PostView = React.createClass({

	propTypes: {
		allBevies: React.PropTypes.array,
		activeBevy: React.PropTypes.object,
		allThreads: React.PropTypes.array,
		activeMember: React.PropTypes.object,
		allPosts: React.PropTypes.array
	},

	getInitialState: function() {
		return {};
	},

	render: function() {

		var body = (this.props.allBevies.length > 1)
		? (
			<div>
				<NewPostPanel
					activeBevy={ this.props.activeBevy }
					allBevies={ this.props.allBevies }
				/>
				<PostSort />
				<PostContainer
					allPosts={ this.props.allPosts }
					activeMember={ this.props.activeMember }
					activeBevy={ this.props.activeBevy }
				/>
			</div>
		)
		: (
			<Lonesome />
		);

		return (
			<div className='main-section'>
				<div className='row'>
					<LeftSidebar
						allBevies={ this.props.allBevies }
						activeBevy={ this.props.activeBevy }
						allThreads={ this.props.allThreads }
					/>
					<div className='col-xs-6'>
						{ body }
					</div>
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
