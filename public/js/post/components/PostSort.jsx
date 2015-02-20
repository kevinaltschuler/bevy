'use strict';

var React = require('react');
var $ = require('jquery');

var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');


function getSortState() {
	return PostStore.getSort();
}

var PostSort = React.createClass({

	getInitialState: function() {
		return getSortState();
	},

	sort: function(ev) {
		var by = ev.target.textContent;

		this.setState({
			  by: by
			, direction: 'asc'
		});

		// now call action
		PostActions.sort(by);
	},

	render: function() {

		var sort_types = 'top new'.split(' ');
		var sorts = [];
		for(var key in sort_types) {
			var type = sort_types[key];

			var id = type + '-btn';
			var className = 'sort-btn btn';
			if(type === this.state.by) className += ' active';

			var dot = (key == (sort_types.length-1)) ? '' : '•';

			sorts.push( <button type='button' className={ className }
							key={ id } id={ id } onClick={ this.sort }>{ type }
							</button>);
			sorts.push(dot);
		}

		return	<div className="sort-well">
						<div className="col-xs-12 btn-group btn-group-sort" role="group">
							<text className="btn-group-text">
								{ sorts }
							</text>
						</div>
					</div>;
	}
});

module.exports = PostSort;
