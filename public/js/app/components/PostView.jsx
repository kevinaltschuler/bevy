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
		allPosts: React.PropTypes.array,
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
			var postContainer = (this.props.allPosts == undefined)
			?	<div>
					loading
				</div>
			:	<PostContainer
					allPosts={ this.props.allPosts }
					activeBevy={ this.props.activeBevy }
					sortType={ this.props.sortType }
				/>;
			var body = (
				<div>
					<NewPostPanel
						activeBevy={ this.props.activeBevy }
						myBevies={ this.props.myBevies }
						disabled={ _.isEmpty(window.bootstrap.user)}
					/>
					<PostSort 
						activeBevy={ this.props.activeBevy}
						sortType={ this.props.sortType }
					/>
					{postContainer}
				</div>
			);

			return (
				<div className='main-section'>
					<LeftSidebar
						myBevies={ this.props.myBevies }
						activeBevy={ this.props.activeBevy }
						allThreads={ this.props.allThreads }
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
