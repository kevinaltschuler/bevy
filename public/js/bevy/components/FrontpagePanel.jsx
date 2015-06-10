'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var rbs = require('react-bootstrap');
var Input = rbs.Input;
var Button = rbs.Button;

var constants = require('./../../constants');

var FrontpagePanel = React.createClass({

	onFeedback: function(ev) {
		ev.preventDefault();

		var name = this.refs.name.getValue();
		var body = this.refs.body.getValue();

		$.post(
			constants.siteurl + '/feedback',
			{
				name: name,
				body: body
			},
			function(data) {
				// success
				alert('Feedback sent!');
			}
		);
	},

	render: function() {

		var bevyImage = '/img/logo_100.png';
		var name = 'Frontpage';
		var description = 'Welcome to Bevy!';

		var bevyImageStyle = {
			backgroundImage: 'url(' + bevyImage + ')',
			backgroundSize: '50px 50px',
		}

		return (
			<div className='right-sidebar panel frontpage'>
				<div className="row sidebar-top">
					<div className="col-xs-3 sidebar-picture frontpage">
						<div className='profile-img' style={ bevyImageStyle }/>
					</div>
					<div className="col-xs-9 sidebar-title frontpage">
						<span
							className='sidebar-title-name'>
							{ name }
						</span>
						<span
							className='sidebar-title-description'>
							{ description }
						</span>
					</div>
				</div>

				<hr />

				<div className='row feedback'>
					<span className='col-xs-12 feedback-title'>Feedback</span>
					<div className='col-xs-12'>
						<Input
							type='text'
							placeholder='Name (optional)'
							ref='name'
						/>
					</div>
					<div className='col-xs-12'>
						<Input
							type='textarea'
							placeholder='What do you think of Bevy?'
							ref='body'
						/>
					</div>
					<div className='col-xs-3'>
						<Button onClick={ this.onFeedback }>
							Submit
						</Button>
					</div>

				</div>
			</div>
		);
	}
});

module.exports = FrontpagePanel;
