/**
 * AliasItem.jsx
 *
 * @author albert
 */

var React = require('react');
var $ = require('jquery');

var rbs = require('react-bootstrap');
var Button = rbs.Button;

var AliasActions = require('./../AliasActions');

var AliasItem = React.createClass({

	propTypes: {
		alias: React.PropTypes.object
	},

	switch: function(ev) {
		var $target = $(ev.target);
		console.log($target.attr('id'));

		AliasActions.switch($target.attr('id'));
	},

	render: function() {

		var alias = this.props.alias;
		if(!alias) {
			// no alias
			return <div></div>;
		}

		return	<Button { ...this.props} onClick={ this.switch } >
						{ alias.name }
					</Button>
	}
});
module.exports = AliasItem;
