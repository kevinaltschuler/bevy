'use strict';

var React = require('react');

module.exports = React.createClass({
	render: function() {
		return	<div className="col-xs-12">
						<div className="input-group">
							<input type="text" className="form-control" placeholder=" "/>
							<span className="input-group-btn">
								<button className="btn btn-default" data-toggle="tooltip"
								data-placement="right" title="" data-original-title="add media to your post" type="button">+
								</button>
							</span>
						</div>
					</div>;
	}
});
