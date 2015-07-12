'use strict';

var React = require('react');
var _ = require('underscore');

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

	render: function() {

		var activeBevy = this.props.activeBevy;
		var joined = _.find(this.props.allBevies, function(_bevy) { return (_bevy._id == activeBevy._id)});

		if(this.props.activeBevy._id === undefined) {
			return (
			<div className='main-section'>
				<h1>404: Not Found</h1>
			</div>);
		}
		else {
			var body = (
				<div>
					<NewPostPanel
						activeBevy={ this.props.activeBevy }
						allBevies={ this.props.allBevies }
						disabled={ joined }
					/>
					<PostSort />
					<PostContainer
						allPosts={ this.props.allPosts }
						activeMember={ this.props.activeMember }
						activeBevy={ this.props.activeBevy }
					/>
				</div>
			);

			return (
				<div className='main-section'>
					<LeftSidebar
						allBevies={ this.props.allBevies }
						activeBevy={ this.props.activeBevy }
						allThreads={ this.props.allThreads }
						allContacts={ this.props.allContacts }
					/>
					<div className='post-view-body'>
						{ body }
					</div>
					<RightSidebar
						activeBevy={ this.props.activeBevy }
						activeMember={ this.props.activeMember }
					/>
				</div>
			);
		}
	}
});

module.exports = PostView;
