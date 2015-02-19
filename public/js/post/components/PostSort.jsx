'use strict';

var React = require('react');

var PostActions = require('./../PostActions');

module.exports = React.createClass({

	sort: function(ev) {
		var by = ev.target.textContent;
		PostActions.sort(by);
	},

	render: function() {
		return	<div className="sort-well">
						<div className="col-xs-12 btn-group btn-group-sort" role="group">
							<text className="btn-group-text">
								<button type="button" className="sort-btn btn active"
									id="top-btn" onClick={ this.sort }>
									top
								</button>
								•
								<button type="button" className="sort-btn btn"
									id="new-btn" onClick={ this.sort }>
									new
								</button>
							</text>
						</div>
					</div>;
	}
});
