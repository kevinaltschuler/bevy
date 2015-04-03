/**
 * ContactsModal.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Modal = rbs.Modal;

var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;

var ContactsList = require('./ContactsList.jsx');

var ContactsModal = React.createClass({

	propTypes: {
		  title: React.PropTypes.string
		, contacts: React.PropTypes.array
	},

	render: function() {

		return <Modal className="saved-posts-modal" {...this.props} title={this.props.title}>
					<ContactsList
						contacts={ this.props.contacts } />
				 </Modal>
	}
});

module.exports = ContactsModal;
