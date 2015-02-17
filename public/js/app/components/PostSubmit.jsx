'use strict';

var React = require('react');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;

module.exports = React.createClass({
	render: function() {
		return	<div className="col-xs-12">
						<div className="input-group">
							<input type="text" className="form-control" placeholder=" "/>
							<span className="input-group-btn">
								<OverlayTrigger placement="right" overlay={
									<Tooltip>Add a post to this bevy</Tooltip>
								}>
									<button className="btn btn-default" data-toggle="tooltip"
									data-placement="right" title="" data-original-title="add media to your post" type="button">+
									</button>
								</OverlayTrigger>
							</span>
						</div>
					</div>;
	}
});
