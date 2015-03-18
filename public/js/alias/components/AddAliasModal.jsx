/**
 * AddAliasModal.jsx
 *
 * @author albert
 */

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Modal = rbs.Modal;
var Input = rbs.Input;
var Button = rbs.Button;

var AliasActions = require('./../AliasActions');

var AddAliasModal = React.createClass({

	getInitialState: function() {
		return {
			nameBsStyle: ''
		};
	},

	addAlias: function(ev) {
		ev.preventDefault();

		var name = this.refs.name.getValue();
		if(_.isEmpty(name)) {
			this.setState({
				nameBsStyle: 'error'
			});
			return;
		}

		AliasActions.create(name);
	},

	render: function() {
		return	<Modal {...this.props} title="Add Alias">
						<Input
							type='text'
							hasFeedback
							bsStyle={ this.state.nameBsStyle }
							placeholder='Alias Name'
							ref='name'/>
						<Button onClick={ this.addAlias }>
							Add Alias
						</Button>
						<Button onClick={ this.props.onRequestHide }>
							Cancel
						</Button>
					</Modal>
	}
});
module.exports = AddAliasModal;
