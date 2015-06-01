'use strict';

var React = require('react');
var $ = require('jquery');

var rbs = require('react-bootstrap');
var Button = rbs.Button;

var router = require('./../../router');
var constants = require('./../../constants');

var BevyActions = require('./../../bevy/BevyActions');

var LeftSidebar = require('./LeftSidebar.jsx');
var PublicBevyRequest = require('./PublicBevyRequest.jsx');
var PublicBevyPanel = require('./../../bevy/components/PublicBevyPanel.jsx');

var PublicView = React.createClass({

	getInitialState: function() {

		$.ajax({
			url: constants.apiurl + '/bevies/' + router.bevy_id,
			method: 'GET',
			success: function(bevy) {
				this.setState({
					bevy: bevy
				});
			}.bind(this),
			error: function(jqXHR) {
				this.setState({
					bevy: null
				});
			}.bind(this)
		});

		return {
			bevy: -1
		};
	},

	render: function() {
		var bevy = this.state.bevy;
		if(bevy === -1) {
			return (
				<div className='main-section not-in-bevy'>
					<div className='bevy-message'>Fetching Bevy...</div>
				</div>
			);
		}
		if(!bevy) {
			return (
			<div className='main-section not-in-bevy'>
				<LeftSidebar
					allBevies={ this.props.allBevies }
					activeBevy={this.props.activeBevy}
				/>
				<div className='bevy-message'>Bevy Not Found</div>
			</div>
			);
		}

		return (
			<div className='main-section not-in-bevy'>
				<LeftSidebar
					allBevies={ this.props.allBevies }
					activeBevy={ this.props.activeBevy }
				/>
				<PublicBevyRequest bevy={bevy}/>
				<PublicBevyPanel activeBevy={bevy} />
			</div>
		);
	}
});

module.exports = PublicView;
