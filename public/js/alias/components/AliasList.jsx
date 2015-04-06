/**
 * AliasList.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;

var AliasItem = require('./AliasItem.jsx');

var AliasList = React.createClass({

	propTypes: {
		allAliases: React.PropTypes.array,
		activeAlias: React.PropTypes.object
	},

	render: function() {

		var allAliases = this.props.allAliases;
		var aliases = [];

		if(allAliases.length < 1) {
			// no aliases
			return	<div>
							no aliases
						</div>;
		}

		for(var key in allAliases) {
			var alias = allAliases[key];
			var isActive = (alias._id == this.props.activeAlias.id) ? true : false;
			aliases.push(
				<AliasItem
					key={ alias._id }
					id={ alias._id }
					alias={ alias }
					active={ isActive }
				/>
			);
		}

		//console.log(this.props.activeAlias);

		return	<div className='alias-list'>
						{ aliases }
					</div>
	}
});
module.exports = AliasList;
