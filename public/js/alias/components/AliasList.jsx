/**
 * AliasList.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');

var AliasList = React.createClass({

	propTypes: {
		allAliases: React.PropTypes.array
	},

	render: function() {

		var allAliases = this.props.allAliases;
		var aliases = [];

		if(allAliases.length < 1) {
			// no aliases
			return	<div>
						</div>;
		}

		for(var key in allAliases) {
			var alias = allAliases[key];
			aliases.push(
				<div key={ alias.id }>{ alias.name }<br/></div>
			);
		}

		return	<div>
						{ aliases }
					</div>
	}
});
module.exports = AliasList;
