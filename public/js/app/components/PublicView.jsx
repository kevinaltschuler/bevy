'use strict';

var React = require('react');
var $ = require('jquery');

var router = require('./../../router');
var constants = require('./../../constants');

var PublicView = React.createClass({

	getInitialState: function() {

		$.ajax({
			url: constants.apiurl + '/bevies/' + router.bevy_id,
			method: 'GET',
			success: function(data) {
				this.setState({
					bevy: data
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
				<div className='main-section'>
					<h1>Fetching Bevy...</h1>
				</div>
			);
		}
		if(!bevy) {
			return (
				<div className='main-section'>
					<h1>Bevy Not Found</h1>
					<a href='/b/frontpage'>back to frontpage</a>
				</div>
			);
		}

		return (
			<div className='main-section'>
				<h1>{ bevy.name }</h1>
				<h2>{ bevy.description }</h2>
				<img src={bevy.image_url} />
			</div>
		);
	}
});

module.exports = PublicView;
