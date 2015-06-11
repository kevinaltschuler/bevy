'use strict';

var React = require('react');
var _ = require('underscore');

var ChatPanel = require('./ChatPanel.jsx');

var ChatDock = React.createClass({

	propTypes: {
		openThreads: React.PropTypes.array
	},

	getInitialState: function() {
		return {};
	},

	render: function() {

		//console.log(this.props.openThreads);

		var threads = [];
		var openThreads = (_.isEmpty(this.props.openThreads)) ? [] : this.props.openThreads;
		for(var key in openThreads) {
			var thread = openThreads[key];
			threads.push(
				<ChatPanel
					key={ 'panel' + thread._id }
					thread={ thread }
				/>
			);
		}

		return (
			<div className='row chat-dock'>
				{ threads }
			</div>
		);
	}
});

module.exports = ChatDock;
