/**
 * AliasItem.jsx
 *
 * @author albert
 */

var React = require('react');
var $ = require('jquery');

var rbs = require('react-bootstrap');
var ButtonGroup = rbs.ButtonGroup;
var Button = rbs.Button;

var AliasActions = require('./../AliasActions');

var AliasItem = React.createClass({

	propTypes: {
		alias: React.PropTypes.object
	},

	switch: function(ev) {
		var $target = $(ev.target);
		//console.log($target.attr('id'));

		AliasActions.switch($target.attr('id'));
	},

	destroy: function(ev) {
		if(!window.confirm('Are you sure?')) return;
		//if(!this.props.alias) return;
		var id = this.props.alias._id;

		AliasActions.destroy(id);
	},

	edit: function(ev) {

	},

	render: function() {

		var alias = this.props.alias;
		if(!alias) {
			// no alias
			return <div></div>;
		}

		return	<div>
						<ButtonGroup>
							<Button
								{ ...this.props}
								ref='alias'
								onClick={ this.switch } >
								{ alias.name }
							</Button>
							<Button
								ref='edit'
								onClick={ this.edit } >
								Edit
							</Button>
							<Button
								ref='delete'
								onClick={ this.destroy } >
								Delete
							</Button>
						</ButtonGroup>
						<br />
					</div>
	}
});
module.exports = AliasItem;
