'use strict';

var React = require('react');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;
var Input = require('react-bootstrap').Input;

var PostSubmit = require('./PostSubmit.jsx');

module.exports = React.createClass({

	render: function() {
		return	<span className="input-group-btn">
					<OverlayTrigger placement="right" overlay={
						<Tooltip>Attach Media</Tooltip>
					}>
						<button className="btn btn-default btn-submit" data-toggle="tooltip"
							data-placement="right" title="" data-original-title="add media to your post"
							type="button" onClick={ PostSubmit.submit }>+
						</button>
					</OverlayTrigger>
					<button className="btn btn-default btn-submit" data-toggle="tooltip"
						data-placement="right" title="" data-original-title="add media to your post"
						type="button" onClick={ PostSubmit.submit }>+
					</button>
				</span>
	}
});