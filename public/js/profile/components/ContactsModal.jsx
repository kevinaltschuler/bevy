/**
 * ContactsModal.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var ReactPropTypes = React.PropTypes;
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
		  title: ReactPropTypes.string
	},

	render: function() {

		return	<Modal className="saved-posts-modal" {...this.props} title={this.props.title}>
					<ContactsList />
				</Modal>
	}
});

module.exports = ContactsModal;
