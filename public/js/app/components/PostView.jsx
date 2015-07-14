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
		myBevies: React.PropTypes.array,
		activeBevy: React.PropTypes.object,
		allThreads: React.PropTypes.array,
		activeMember: React.PropTypes.object,
		allPosts: React.PropTypes.array,
		superBevy: React.PropTypes.object.isRequired,
		subBevies: React.PropTypes.array
	},

	render: function() {

		var activeBevy = this.props.activeBevy;
		var joined = undefined;
		if (_.isEmpty(this.props.myBevies)) {
			joined = false;
		}
		else {
			joined = _.find(this.props.myBevies, function(_bevy) { 
				return _bevy._id == activeBevy._id;
			});
			joined = (joined == undefined) ? false : true;
		}

		if(this.props.activeBevy._id === undefined) {
			return (
				<div />
			);
		}
		else {
			var body = (
				<div>
					<NewPostPanel
						activeBevy={ this.props.activeBevy }
						myBevies={ this.props.myBevies }
						disabled={ !joined }
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
						myBevies={ this.props.myBevies }
						activeBevy={ this.props.activeBevy }
						allThreads={ this.props.allThreads }
						allContacts={ this.props.allContacts }
						superBevy={ this.props.superBevy }
						subBevies={ this.props.subBevies }
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
