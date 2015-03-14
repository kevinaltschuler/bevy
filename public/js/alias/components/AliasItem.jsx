/**
 * AliasItem.jsx
 *
 * @author albert
 */

var React = require('react');

var AliasItem = React.createClass({

	propTypes: {
		alias: React.PropTypes.object
	},

	render: function() {

		var alias = this.props.alias;
		if(!alias) {
			// no alias
			return <div></div>;
		}

		return	<div>
						<a>{ alias.name }</a>
					</div>
	}
});
module.exports = AliasItem;
