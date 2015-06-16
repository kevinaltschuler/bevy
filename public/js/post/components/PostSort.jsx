/**
 * PostSort.jsx
 *
 * Sort posts with this handy neat little bar
 *
 * @author albert
 */

'use strict';

// imports
var React = require('react');

var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');

var rbs = require('react-bootstrap');
var Well = rbs.Well;
var Button = rbs.Button;
var ButtonGroup = rbs.ButtonGroup;


/**
 * grab the current sort mechanism from the store
 * defaults to 'top' and 'asc'
 * see PostStore#getSort() for more details
 * @return {object} by:String, direction:String
 */
function getSortState() {
	return PostStore.getSort();
}

// React class
var PostSort = React.createClass({

	// grab initial sorting mechanism
	// should default to 'top' and 'asc'
	getInitialState: function() {
		return getSortState();
	},

	/**
	 * send the sort action
	 * and update the state for immediate
	 * visual feedback
	 * @param  {ev} browser (synthetic) event
	 */
	sort: function(ev) {
		// get the sort type that was triggered
		var by = ev.target.textContent;

		// update the state immediately
		// should trigger a rerender
		this.setState({
			by: by,
			direction: 'asc'
		});

		// now call action
		PostActions.sort(by);
	},

	render: function() {

		// add to this string to add more types to the top
		// split function turns this string into an array
		var sort_types = 'top new'.split(' ');
		// array of react components to inject
		var sorts = [];

		// for each sort type
		for(var key in sort_types) {
			var type = sort_types[key];

			// generate html attributes
			var id = type + '-btn';
			var className = 'sort-btn btn';
			// if this type matches the current sorting mechanism (stored in the state)
			// make it active
			if(type === this.state.by.trim()) className += ' active';

			// the dot that separates types
			// don't generate for the last one
			var dot = (key == (sort_types.length-1)) ? '' : '•';

			sorts.push(
				<Button
					type='button'
					className={ className }
					key={ id }
					id={ id }
					onClick={ this.sort }
				> { type }
				</Button>
			);
			sorts.push(dot);
		}

		return <Well className="sort-well">
					<ButtonGroup className='sort-btn-group' role="group">
							{ sorts }
					</ButtonGroup>
				 </Well>;
	}
});

module.exports = PostSort;
