/**
*
* public bevy panel
* made by kevin
*/
'use strict';

var React = require('react');
var $ = require('jquery');

var rbs = require('react-bootstrap');
var Button = rbs.Button;

var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;

var BevyActions = require('./../../bevy/BevyActions');

var PublicBevyRequest = React.createClass({
	propTypes: {
		bevy: React.PropTypes.object
	},

	render: function() {
		var bevy = this.props.bevy;

		var bevyImage = bevy.image_url;
		var bevyImageStyle = {
			backgroundImage: 'url(' + bevyImage + ')',
			backgroundSize: '100% auto',
		};

		return (
			<div className='public-bevy-request'>
				<div className='message'>This bevy requires an invitation</div>
			</div>
		)
	},
})

module.exports = PublicBevyRequest;
