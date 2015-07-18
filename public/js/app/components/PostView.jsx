'use strict';

var React = require('react');
var _ = require('underscore');

var router = require('./../../router');

var PostSort = require('./../../post/components/PostSort.jsx');
var PostContainer = require('./../../post/components/PostContainer.jsx');
var NewPostPanel = require('./../../post/components/NewPostPanel.jsx');
var PublicChatPanel = require('./../../chat/components/PublicChatPanel.jsx');
var LeftSidebar = require('./LeftSidebar.jsx');
var RightSidebar = require('./RightSidebar.jsx');
var Lonesome = require('./Lonesome.jsx');

var BevyActions = require('./../../bevy/BevyActions');

var PostView = React.createClass({

	propTypes: {
		myBevies: React.PropTypes.array,
		activeBevy: React.PropTypes.object,
		allThreads: React.PropTypes.array,
		allPosts: React.PropTypes.array,
		superBevy: React.PropTypes.object.isRequired,
		subBevies: React.PropTypes.array
	},

	render: function() {

		var activeBevy = this.props.activeBevy;

		if(this.props.activeBevy.name == null) {
			console.log('undefined active bevy.');
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
						disabled={ _.isEmpty(window.bootstrap.user)}
						subBevies={ this.props.subBevies }
						superBevy={ this.props.superBevy }
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
					<PublicChatPanel 
						activeThread={ this.props.activeThread }
						activeBevy={ this.props.activeBevy }
					/>
					<LeftSidebar
						myBevies={ this.props.myBevies }
						activeBevy={ this.props.activeBevy }
						superBevy={ this.props.superBevy }
						subBevies={ this.props.subBevies }
					/>
					<div className='post-view-body'>
						{ body }
					</div>
					<RightSidebar
						activeBevy={ this.props.activeBevy }
						disabled={ _.isEmpty(window.bootstrap.user) }
						myBevies={ this.props.myBevies }
					/>
				</div>
			);
		}
	}
});

module.exports = PostView;
