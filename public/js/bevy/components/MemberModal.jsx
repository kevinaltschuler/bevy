/**
 * MemberModal.jsx
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

var MemberList = require('./MemberList.jsx');

var MemberModal = React.createClass({

	propTypes: {
		  title: React.PropTypes.string
		, contacts: React.PropTypes.array
		, activeBevy: React.PropTypes.object
	},

	render: function() {

		return <Modal className="saved-posts-modal" {...this.props} title={this.props.title}>
					<MemberList
						activeBevy={ this.props.activeBevy }
						contacts={ this.props.contacts } />
				 </Modal>
	}
});

module.exports = MemberModal;
