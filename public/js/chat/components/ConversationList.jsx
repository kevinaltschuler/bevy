'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Button = rbs.Button;

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
					<Button className='conversation-item' key={ 'thread' + bevy._id } id={ thread._id } onClick={ this.openThread }>
						<img className='bevy-img' src={ bevy.image_url } />
						<span className='bevy-name'>{ bevy.name }</span>
					</Button>
			);
		}

		return (
			<div className='conversation-list panel'>
				<div className='conversation-list-header'>
					<span>Conversations</span>
				</div>
				<div className='list-links'>
					{ threads }
				</div>
			</div>
		);
	}
});

module.exports = ConversationList;
