/**
 * SettingsModal.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Panel = rbs.Panel;
var Input = rbs.Input;
var Button = rbs.Button;
var Modal = rbs.Modal;

var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;

var SavedPostsList = require('./SavedPostsList.jsx');

var SavedPostsModal = React.createClass({

	render: function() {

		return	<Modal className="saved-posts-modal" {...this.props} title="Your Saved Posts">
					<SavedPostsList />
				</Modal>
	}
});

module.exports = SavedPostsModal;
