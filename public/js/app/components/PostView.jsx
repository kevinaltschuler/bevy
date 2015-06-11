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
					<LeftSidebar
						allBevies={ this.props.allBevies }
						activeBevy={ this.props.activeBevy }
						allThreads={ this.props.allThreads }
					/>
					<div className='col-xs-6'>
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
