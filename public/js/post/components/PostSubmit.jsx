/**
 * PostSubmit.jsx
 *
 * The dialog for creating a post
 *
 * @author albert
 */

'use strict';

// imports
var React = require('react');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;
var Input = require('react-bootstrap').Input;

var PostActions = require('./../PostActions');

// React class
var PostSubmit = React.createClass({

	// trigger the create action
	// TODO: pass in the rest of the state attributes needed
	submit: function() {
		PostActions.create(this.state.title);
	},

	// start with an empty title
	// TODO: when the dialog is expanded, add the default options here
	getInitialState: function() {
		return {
			title: ''
		};
	},

	// used to trigger the create action (enter key)
	// later, we can use this to listen for ctrl+v and other media shortcuts
	onKeyUp: function(ev) {
		//if the user hits enter, submit a new post
		if(ev.which === 13) {
			this.submit();
			// empty the current title attribute
			// in case the user wants to enter another right quick
			this.setState({
				title: ''
			});
		}
	},

	// triggered every time a key is pressed
	// updates the state
	handleChange: function() {
		this.setState({
			title: this.refs.input.getValue()
		})
	},

	render: function() {
			return  <Input
					  type="text"
					  value={ this.state.title }
					  placeholder="New Post"
					  hasFeedback
					  ref="input"
					  groupClassName="group-class"
					  wrapperClassName="wrapper-class"
					  labelClassName="label-class"
					  onChange={ this.handleChange }
					  onKeyUp={ this.onKeyUp } />
	}
});

module.exports = PostSubmit;
