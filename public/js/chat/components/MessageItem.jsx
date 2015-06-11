'use strict';

var React = require('react');

var user = window.bootstrap.user;

var MessageItem = React.createClass({

	propTypes: {
		message: React.PropTypes.object
	},

	render: function() {

		var message = this.props.message;
		var author = message.author;

		var align = (author._id == user._id) ? 'left' : 'right';
		var messageStyle = {
			//float: float
			textAlign: align
		};

		return (
			<div className='message-item' style={ messageStyle }>
				<span>{ author.displayName + ': ' + message.body }</span>
			</div>
		);
	}
});

module.exports = MessageItem;
