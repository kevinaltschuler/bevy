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

	componentDidMount: function() {
		PostStore.on('change', this._onSortChange);
	},
	componentWillUnmount: function() {
		PostStore.off('change', this._onSortChange);
	},

	_onSortChange: function() {
		this.setState(getSortState());
	},

	sort: function(ev) {

		// visual changes
		var id = ev.target.getAttribute('id');
		// remove all active classes first
		$('.sort-well button.sort-btn').removeClass('active');
		// then apply to active one
		$('button#' + id).addClass('active');

		// now call action
		var by = ev.target.textContent;
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
							id={ id } onClick={ this.sort }>{ type }
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
