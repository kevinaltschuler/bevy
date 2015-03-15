/**
 * AliasItem.jsx
 *
 * @author albert
 */

var React = require('react');

var rbs = require('react-bootstrap');
var Button = rbs.Button

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

		return	<Button>
						{ alias.name }
					</Button>
	}
});
module.exports = AliasItem;
