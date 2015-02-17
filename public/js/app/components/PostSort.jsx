'use strict';

var React = require('react');

module.exports = React.createClass({
	render: function() {
		return <div className="sort-well">
		          <div className="col-xs-12 btn-group btn-group-sort" role="group">
		            <text className="btn-group-text">
		              <button type="button" className="sort-btn btn active" id="top-btn">top</button>
		              •
		              <button type="button" className="sort-btn btn" id="new-btn">new</button>
		            </text>-
		          </div>
		        </div>;
	}
});