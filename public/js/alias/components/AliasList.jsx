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
		allAliases: React.PropTypes.array
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
			aliases.push(
				<AliasItem key={ alias.id } alias={ alias } />
			);
		}

		return	<div>
						aliases:
						<ButtonGroup vertical>
							{ aliases }
						</ButtonGroup>
					</div>
	}
});
module.exports = AliasList;
