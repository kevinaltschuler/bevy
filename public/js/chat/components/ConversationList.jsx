'use strict';

var React = require('react');
var _ = require('underscore');

var ChatActions = require('./../ChatActions');

var ConversationList = React.createClass({

	propTypes: {
		allThreads: React.PropTypes.array
	},

	openThread: function(ev) {
		ev.preventDefault();

		var thread_id = ev.target.getAttribute('id');

		ChatActions.openThread(thread_id);
	},

	render: function() {

		var threads = [];
		var allThreads = (_.isEmpty(this.props.allThreads)) ? [] : this.props.allThreads;
		for(var key in allThreads) {
			var thread = allThreads[key];
			var bevy = thread.bevy;
			threads.push(
				<li key={ 'thread' + bevy._id }>
					<a href="#" id={ thread._id } onClick={ this.openThread }>
						{ bevy.name }
					</a>
				</li>
			);
		}

		return (
			<div className='conversation-list panel'>
				<span className='conversation-list-header'>Conversations</span>
				<ul>
					{ threads }
				</ul>
			</div>
		);
	}
});

module.exports = ConversationList;
